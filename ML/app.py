from fastapi import FastAPI, UploadFile, File, Query, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal, List, Optional
from pydantic import BaseModel
import time
import re
import requests
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.utils import custom_object_scope
from PIL import Image
import io
import numpy as np

# ---------- Swagger Models ----------

class BlastResponse(BaseModel):
    status: str
    rid: Optional[str] = None
    result: Optional[str] = None
    response: Optional[str] = None

class TaxonomyImageResponse(BaseModel):
    class_index: int
    class_name: str
    confidence: float

class GBIFResponse(BaseModel):
    usageKey: Optional[int]
    scientificName: Optional[str]
    rank: Optional[str]
    status: Optional[str]

class AgePredictionItem(BaseModel):
    x: str
    y: float

# ---------- FastAPI App ----------

app = FastAPI(
    title="eDNA & Fish Age Prediction API",
    description="API for BLAST queries, fish species classification, and fish age prediction using deep learning.",
    version="1.0.0"
)

# ---------- CORS Middleware ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- BLAST URL ----------
BLAST_URL = "https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi"

# ---------- Load Models ----------
model = tf.keras.models.load_model(
    r".\taxo.h5"
)

gpus = tf.config.list_physical_devices('GPU')
if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)

class_map = {
    0: 'Black Sea Sprat',
    1: 'Gilt-Head Bream',
    2: 'Hourse Mackerel',
    3: 'Red Mullet',
    4: 'Red Sea Bream',
    5: 'Sea Bass',
    6: 'Shrimp',
    7: 'Striped Red Mullet',
    8: 'Trout'
}
taxonomy_map = {
    "Black Sea Sprat": "Clupeonella cultriventris",
    "Gilt-Head Bream": "Sparus aurata",
    "Hourse Mackerel": "Trachurus trachurus",
    "Red Mullet": "Mullus barbatus",
    "Red Sea Bream": "Pagellus bogaraveo",
    "Sea Bass": "Dicentrarchus labrax",
    "Shrimp": "Crangon crangon",
    "Striped Red Mullet": "Mullus surmuletus",
    "Trout": "Salmo trutta"
}

class FixedDropout(tf.keras.layers.Dropout):
    def call(self, inputs, training=None):
        return super().call(inputs, training=True)

with custom_object_scope({'FixedDropout': FixedDropout}):
    PREDICTORS = {
        "redFish": {
            "model": tf.keras.models.load_model(
                r".\OthoModels\mullet.h5"
            ),
            "age-groups": ["0", "1", "2", "3", "4", "5+"]
        },
        "halibut": {
            "model": tf.keras.models.load_model(
                r".\OthoModels\norway.h5"
            ),
            "age-groups": [str(i) for i in range(1, 27)]
        },
        "river-salmon": {
            "model": tf.keras.models.load_model(
                r".\OthoModels\salmon_river_age.hdf5",
                compile=False
            ),
            "age-groups": ["1", "2", "3", "4", "5"]
        },
        "sea-salmon": {
            "model": tf.keras.models.load_model(
                r".\OthoModels\salmon_sea_age.hdf5",
                compile=False
            ),
            "age-groups": ["1", "2", "3", "4", "5", "6", "7", "8"]
        },
    }

# ---------- Endpoints ----------

@app.post("/blast", response_model=BlastResponse, summary="Run BLAST Query")
async def blast(file: UploadFile = File(..., description="FASTA file to query"),
                isProteinSequence: bool = Query(..., description="True if protein sequence, False for nucleotide")):
    """
    Submit a BLAST query to NCBI for nucleotide or protein sequences.
    Returns the RID and result text once ready.
    """
    fastaSeq = (await file.read()).decode()
    params = {
        "CMD": "Put",
        "PROGRAM": "blastp" if isProteinSequence else "blastn",
        "DATABASE": "nt",
        "QUERY": fastaSeq,
    }
    response = requests.post(BLAST_URL, data=params)
    text = response.text
    RID = re.search(r"RID\s*=\s*(\S+)", text)
    RTOE = re.search(r"RTOE\s*=\s*(\d+)", text)

    if not RID:
        return JSONResponse(status_code=500, content={"error": "Couldn't assign RID", "response": text})

    rid = RID.group(1)
    rtoe = int(RTOE.group(1)) if RTOE else 20
    while True:
        check = requests.get(BLAST_URL, params={"CMD": "Get", "RID": rid, "FORMAT_OBJECT": "SearchInfo"})
        txt = check.text
        if "Status=WAITING" in txt:
            time.sleep(15)
            continue
        elif "Status=FAILED" in txt:
            return {"status": "FAILED"}
        elif "Status=UNKNOWN" in txt:
            return {"status": "UNKNOWN"}
        elif "Status=READY" in txt:
            result = requests.get(BLAST_URL, params={"CMD": "Get", "RID": rid, "FORMAT_TYPE": "Text"})
            return {"status": "READY", "rid": rid, "result": result.text}
        else:
            return {"status": "ERROR", "response": txt[:500]}

@app.post("/taxonomyImage", response_model=TaxonomyImageResponse, summary="Classify Fish Image")
async def taxoImage(file: UploadFile = File(..., description="Image of the fish to classify")):
    """
    Predict the fish species from an uploaded image.
    Returns the predicted class index, class name, and confidence score.
    """
    try:
        content = await file.read()
        img = Image.open(io.BytesIO(content)).convert("RGB")
        img = img.resize((224, 224))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
        preds = model.predict(img_array)
        predicted_class = int(np.argmax(preds, axis=1)[0])
        confidence = float(np.max(preds))
        return {
            "class_index": predicted_class,
            "class_name": taxonomy_map[class_map[predicted_class]],
            "confidence": round(confidence, 4)
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/taxonomyClassifier", response_model=GBIFResponse, summary="GBIF Species Lookup")
async def taxoClassify(name: str = Query(..., description="Common or scientific fish name")):
    """
    Fetch species information from GBIF API.
    """
    try:
        url = f"https://api.gbif.org/v1/species/match?name={name}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return JSONResponse(status_code=response.status_code, content={"error": f"Failed to fetch from GBIF. Status: {response.status_code}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/OthoAge", response_model=List[List[AgePredictionItem]], summary="Predict Fish Age")
async def predict(
    fishType: Literal["redFish", "halibut", "river-salmon", "sea-salmon"] = Form(..., description="Type of fish"),
    images: List[UploadFile] = File(..., description="One or more fish images for age prediction")
):
    """
    Predict the age group(s) of uploaded fish images based on the fish type.
    Returns a list of age predictions for each image.
    """
    if fishType not in PREDICTORS:
        raise HTTPException(status_code=400, detail="Invalid fish type")

    predictor = PREDICTORS[fishType]
    results = []

    for f in images:
        content = await f.read()
        img = Image.open(io.BytesIO(content)).convert("RGB")

        # Preprocess image
        if fishType == 'halibut':
            mu = np.load('mu_400.npy')
            std = np.load('std_400.npy')
            img = img.resize((224, 224))
            img_array = img_to_array(img) / 255.0
            for i in range(3):
                img_array[:, :, i] = (img_array[:, :, i] - mu[i]) / std[i]
            img_array = np.expand_dims(img_array, axis=0)
        elif fishType in ['sea-salmon', 'river-salmon']:
            img = img.resize((380, 380))
            img_array = img_to_array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
        else:  # redFish
            img = img.resize((400, 400))
            img_array = img_to_array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)

        # Predict
        yhat = predictor["model"].predict(img_array)
        if fishType == 'halibut':
            yhat = np.exp(yhat)
            yhat = yhat / yhat.sum()
        yhat = yhat.round(2)

        # Map predictions
        if fishType in ['river-salmon', 'sea-salmon']:
            lst_age = [0] * len(predictor['age-groups'])
            ind = int(yhat[0][0])
            lst_age[ind] = 1
            ret = [{'x': age, 'y': val} for age, val in zip(predictor['age-groups'], lst_age)]
        else:
            ret = [{'x': age, 'y': val} for age, val in zip(predictor['age-groups'], yhat[0].tolist())]

        results.append(ret)

    return JSONResponse(content=results if len(results) > 1 else results[0])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)