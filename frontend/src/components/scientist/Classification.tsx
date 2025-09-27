"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/Button"
import { CustomInput } from "../ui/CustomInput"
import { Microscope, Upload, Search, FileText, FolderOutput, GitCompare } from "lucide-react"
import demoOtoliths from "../../data/demoData"

export const Classification: React.FC = () => {
  const [activeModule, setActiveModule] = useState("edna")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [demoResult, setDemoResult] = useState<any | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Comparison state
  const [compareFile, setCompareFile] = useState<File | null>(null)
  const [comparePreview, setComparePreview] = useState<string | null>(null)
  const [compareResult, setCompareResult] = useState<any | null>(null)

  const [uploadText, setUploadText] = useState("")
  const [speciesInfo, setSpeciesInfo] = useState({
    name: "",
    family: "",
    genus: "",
    kingdom: "",
    phylum: "",
    parent: "",
    vernacularName: "",
  })

  // Animated percent state (0..100) per hierarchy item for primary sample
  const [animatedPct, setAnimatedPct] = useState<number[]>([])
  const cancelRef = useRef<{ cancelled?: boolean }>({ cancelled: false })

  useEffect(() => {
    // cleanup object URLs and cancel animations on unmount
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (comparePreview) URL.revokeObjectURL(comparePreview)
      cancelRef.current.cancelled = true
    }
  }, [previewUrl, comparePreview])

  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

  const animateValue = (index: number, target: number, duration = 1200, delay = 0) => {
    const localCancel = cancelRef.current
    setTimeout(() => {
      const start = performance.now()
      const step = (now: number) => {
        if (localCancel.cancelled) return
        const elapsed = now - start
        const t = Math.min(1, elapsed / duration)
        const eased = easeInOut(t)
        const value = eased * target
        setAnimatedPct(prev => {
          const cp = prev.slice()
          cp[index] = Math.max(0, Math.min(100, value))
          return cp
        })
        if (t < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay)
  }

  useEffect(() => {
    cancelRef.current.cancelled = false
    if (!demoResult?.hierarchy) {
      setAnimatedPct([])
      return
    }
    const n = demoResult.hierarchy.length
    setAnimatedPct(Array(n).fill(0))
    demoResult.hierarchy.forEach((h: any, i: number) => {
      const pct = (h.score / 1000) * 100
      const delay = i * 160
      animateValue(i, pct, 1200, delay)
    })
    return () => {
      cancelRef.current.cancelled = true
    }
  }, [demoResult])

  const handleTaxoSubmit = async () => {
    try {
      setIsAnalyzing(true)
      const response = await fetch(
        `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(uploadText)}`
      )
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      console.log(data)
      setSpeciesInfo({
        name: data.scientificName || "",
        family: data.family || "",
        genus: data.genus || "",
        kingdom: data.kingdom || "",
        phylum: data.phylum || "",
        parent: data.parent || "",
        vernacularName: data.vernacularName || "",
      })
    } catch (error) {
      console.error("API Error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // eDNA demo table (left unchanged)
  const classificationResults = [
    { id: 1, sample: "Sample_001", species: "Rastrelliger kanagurta", confidence: 95.2, method: "eDNA" },
    { id: 2, sample: "Sample_002", species: "Chelonia mydas", confidence: 87.8, method: "Morphology" },
    { id: 3, sample: "Sample_003", species: "Acropora cervicornis", confidence: 92.1, method: "Taxonomy" },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null
    if (!f) {
      setUploadedFile(null)
      setPreviewUrl(null)
      return
    }
    setUploadedFile(f)
    // revoke previous preview if any
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(f))
    setDemoResult(null)
    // clear any previous comparison if you want to force fresh compare flow
    setCompareFile(null)
    if (comparePreview) { URL.revokeObjectURL(comparePreview); setComparePreview(null) }
    setCompareResult(null)
  }

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      alert("Select an otolith image to analyze (demo mode).")
      return
    }
    setIsAnalyzing(true)
    setTimeout(() => {
      const key = uploadedFile.name
      const result = demoOtoliths[key] ?? demoOtoliths["CMLREOTL00026.jpg"]
      setDemoResult(result)
      setIsAnalyzing(false)
    }, 800)
  }

  const handleCompareUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null
    if (!f) {
      setCompareFile(null)
      if (comparePreview) { URL.revokeObjectURL(comparePreview); setComparePreview(null) }
      setCompareResult(null)
      return
    }
    setCompareFile(f)
    if (comparePreview) URL.revokeObjectURL(comparePreview)
    setComparePreview(URL.createObjectURL(f))
    setCompareResult(null)
  }

  const handleCompareAnalyze = async () => {
    if (!compareFile) {
      alert("Select a second otolith image for comparison.")
      return
    }
    setIsAnalyzing(true)
    setTimeout(() => {
      const key = compareFile.name
      const result = demoOtoliths[key] ?? demoOtoliths["CMLREOTL00018.jpg"]
      setCompareResult(result)
      setIsAnalyzing(false)
    }, 800)
  }

  // Utility to show morphometric difference percentage (primary -> compare)
  const morphoDiff = (a: number, b: number) => {
    if (a == null || b == null) return "—"
    if (a === 0) return "—"
    const diff = ((b - a) / a) * 100
    return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`
  }

  // Helper: open coordinates in Google Maps
  const openInMaps = (lat?: number, lon?: number) => {
    if (!lat || !lon) return
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Classification Module</h1>
        <p className="text-gray-600">Identify and classify marine species using advanced techniques</p>
      </div>

      <CardContent className="p-2">
        <div className="flex w-full">
          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${
              activeModule === "edna" ? "border-sky-500 text-sky-600 font-semibold" : "border-transparent text-gray-600 hover:text-sky-500"
            }`}
            onClick={() => setActiveModule("edna")}
          >
            eDNA Analysis
          </Button>

          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${
              activeModule === "taxonomy" ? "border-sky-500 text-sky-600 font-semibold" : "border-transparent text-gray-600 hover:text-sky-500"
            }`}
            onClick={() => setActiveModule("taxonomy")}
          >
            Taxonomy
          </Button>

          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${
              activeModule === "otolith" ? "border-sky-500 text-sky-600 font-semibold" : "border-transparent text-gray-600 hover:text-sky-500"
            }`}
            onClick={() => setActiveModule("otolith")}
          >
            Otolith Analysis
          </Button>
        </div>
      </CardContent>

      {activeModule === "edna" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>eDNA Sample Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-sky-600 hover:text-sky-500">Upload DNA Sequence Files</span>
                    <input type="file" onChange={handleFileUpload} className="sr-only" accept=".fasta,.fa,.seq,.txt" />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">NetCDF, HDFS, DwCA, XML formats supported</p>
                </div>
              </div>

              {uploadedFile && (
                <div className="flex items-center space-x-2 text-sm bg-green-50 p-3 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">{uploadedFile.name}</span>
                </div>
              )}

              <Button className="w-full bg-blue-800 text-white " disabled={!uploadedFile}>
                <Microscope className="h-4 w-4 mr-2" />
                Analyze eDNA
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classificationResults
                  .filter((result) => result.method === "eDNA")
                  .map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{result.sample}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            result.confidence >= 90 ? "bg-green-100 text-green-800" : result.confidence >= 80 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Species:</strong> <em>{result.species}</em>
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" className="transition-all duration-200 ease-in-out border hover:bg-slate-400 active:scale-95">
                          <FolderOutput className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeModule === "taxonomy" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Species Database Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <div className="relative w-96">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <CustomInput placeholder="Search species by name or characteristics..." className="pl-10" value={uploadText} onChange={(e) => setUploadText(e.target.value)} />
                  </div>

                  <Button className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white rounded-lg px-6 w-32 transition" onClick={handleTaxoSubmit} disabled={isAnalyzing}>
                    {isAnalyzing ? "Analyzing..." : "Search"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-semibold">{speciesInfo.name}</h3>
                    <p className="text-sm text-gray-600 italic">{speciesInfo.name}</p>

                    <div className="mt-2 space-y-1 text-xs">
                      <p><strong>Family:</strong> {speciesInfo.family}</p>
                      <p><strong>Genus:</strong> {speciesInfo.genus}</p>
                      <p><strong>Kingdom:</strong> {speciesInfo.kingdom}</p>
                      <p><strong>Phylum:</strong> {speciesInfo.phylum}</p>
                      <p><strong>Parent:</strong> {speciesInfo.parent}</p>
                      <p><strong>Vernacular Name:</strong> {speciesInfo.vernacularName}</p>
                    </div>

                    <Button size="sm" variant="outline" className="mt-3 bg-transparent">View Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeModule === "otolith" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sky-700">
                <Microscope className="h-5 w-5 text-sky-600" />
                Otolith Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-sky-200 rounded-md p-6 text-center">
                <Upload className="h-10 w-10 mx-auto text-sky-400" />
                <label className="cursor-pointer block mt-4 text-sky-700 font-medium">
                  <span>Upload Otolith Image</span>
                  <input type="file" onChange={handleFileUpload} className="sr-only" accept=".jpg,.jpeg,.png,.tiff" />
                </label>
                <p className="text-xs text-slate-500 mt-2">High-res JPG/PNG/TIFF preferred (scale bar preserved).</p>
              </div>

              {uploadedFile && (
                <div className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-md p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-sky-600" />
                    <div>
                      <div className="font-medium text-slate-800 truncate">{uploadedFile.name}</div>
                      <div className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => { setUploadedFile(null); if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null) } setDemoResult(null) }}>Remove</Button>
                  </div>
                </div>
              )}

              <div className="mt-2">
                <Button onClick={handleAnalyze} disabled={!uploadedFile || isAnalyzing} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                  {isAnalyzing ? "Analyzing..." : "Analyze Otolith"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sky-700">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {previewUrl ? (
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-3xl border rounded-md overflow-hidden bg-white">
                    <img src={previewUrl} alt={demoResult ? `${demoResult.otolithId} preview` : "otolith preview"} className="w-full object-contain" style={{ maxHeight: 560 }} />
                    <div className="px-3 py-2 border-t border-sky-50 bg-sky-50 text-xs text-slate-700">Scale bar (from image): 2 mm</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">No image uploaded. Preview will appear here.</div>
              )}
            </CardContent>
          </Card>

          {demoResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Sample Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sky-700">Sample Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-800">
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-slate-500">Otolith ID</div>
                        <div className="font-mono text-sm text-slate-900 bg-slate-50 px-2 py-1 rounded">{demoResult.otolithId}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Scientific name</div>
                        <div className="text-sm font-medium text-slate-800 italic">{demoResult.metadata.scientificName || "—"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Submitted by</div>
                        <div className="text-sm text-slate-800">{demoResult.metadata.submittedBy || "—"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Platform / Station</div>
                        <div className="text-sm text-slate-800">{demoResult.metadata.platform || "—"} {demoResult.metadata.stationId ? ` / ${demoResult.metadata.stationId}` : ""}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Collection date</div>
                        <div className="text-sm text-slate-800">{demoResult.metadata.collectionDate || "—"}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-slate-500">Locality</div>
                        <div className="text-sm text-slate-800">{demoResult.metadata.locality || "—"}</div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-slate-500">Coordinates</div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const lat = demoResult.metadata.decimalLatitude ?? ""
                                const lon = demoResult.metadata.decimalLongitude ?? ""
                                const txt = lat && lon ? `${lat}, ${lon}` : ""
                                if (txt) navigator.clipboard.writeText(txt)
                              }}
                              className="text-xs text-sky-600 hover:underline"
                            >
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => openInMaps(demoResult.metadata.decimalLatitude, demoResult.metadata.decimalLongitude)}
                              className="text-xs text-sky-600 hover:underline"
                            >
                              Map
                            </button>
                          </div>
                        </div>
                        <div className="font-mono text-sm text-slate-900 bg-slate-50 px-2 py-1 rounded">{demoResult.metadata.decimalLatitude ?? "—"}, {demoResult.metadata.decimalLongitude ?? "—"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Depth</div>
                        <div className="text-sm text-slate-800">{demoResult.metadata.collectionDepth_m ? `${demoResult.metadata.collectionDepth_m} m` : "—"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Collection method</div>
                        <div className="text-sm text-slate-800">{demoResult.metadata.collectionMethod || "—"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Habitat / Life stage / Sex</div>
                        <div className="text-sm text-slate-800">
                          {(demoResult.metadata.habitat || "—")}
                          {demoResult.metadata.lifeStage ? ` • ${demoResult.metadata.lifeStage}` : ""}
                          {demoResult.metadata.sex ? ` • ${demoResult.metadata.sex}` : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Morphometrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sky-700">Morphometrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-slate-800">
                    <div>
                      <div className="text-xs text-slate-500">Length</div>
                      <div className="text-lg font-semibold">{demoResult.morphometrics.length_mm} mm</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Width</div>
                      <div className="text-lg font-semibold">{demoResult.morphometrics.width_mm} mm</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Area</div>
                      <div className="text-lg font-semibold">{demoResult.morphometrics.area_mm2} mm²</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Circularity</div>
                      <div className="text-lg font-semibold">{demoResult.morphometrics.circularity}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Animated Taxonomic Confidence */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sky-700">Taxonomic Confidence (hierarchical)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demoResult.hierarchy.map((h: any, idx: number) => {
                      const shown = animatedPct[idx] ?? 0
                      const color = h.score > 900 ? "bg-sky-700" : h.score > 700 ? "bg-sky-600" : "bg-sky-500"
                      return (
                        <div key={h.rank} className="p-3 rounded-md border border-sky-50 bg-white flex items-center gap-4">
                          <div className="w-48">
                            <div className="text-xs text-slate-500">{h.rank}</div>
                            <div className="text-sm font-medium text-slate-800 truncate">{h.name}</div>
                          </div>

                          <div className="flex-1">
                            <div className="w-full bg-sky-50 rounded-full h-3 overflow-hidden" aria-hidden>
                              <div
                                className={color}
                                style={{
                                  width: `${Math.min(100, shown)}%`,
                                  height: "100%",
                                  transition: "width 220ms linear"
                                }}
                              />
                            </div>
                          </div>

                          <div style={{ minWidth: 72, textAlign: "right" }}>
                            <div className="text-sm font-semibold text-sky-700">{shown.toFixed(1)}%</div>
                            <div className="text-xs text-slate-400">{h.score} / 1000</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Compare button + flow */}
              {!compareResult && (
                <Card className="lg:col-span-2">
                  <CardContent className="flex gap-3 items-center">
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => document.getElementById("compareUpload")?.click()}>
                      <GitCompare className="h-4 w-4" /> Compare with another otolith
                    </Button>
                    <input id="compareUpload" type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleCompareUpload} />
                    {compareFile && (
                      <div className="flex items-center gap-3 ml-auto">
                        <div className="text-sm text-slate-600">{compareFile.name}</div>
                        <Button className="bg-sky-600 text-white" onClick={handleCompareAnalyze}>Analyze Comparison</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* If compareResult present show side-by-side comparison with images */}
              {compareResult && (
                <>
                  <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Image previews */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sky-700">Primary Otolith</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-64 border rounded overflow-hidden flex items-center justify-center bg-white">
                          <img src={previewUrl || demoResult.image?.previewUrl} alt="primary otolith" className="object-contain max-h-full" />
                        </div>
                        <div className="mt-3 text-sm text-slate-700">
                          <div><strong>ID:</strong> {demoResult.otolithId}</div>
                          <div className="truncate"><strong>Species:</strong> {demoResult.metadata.scientificName}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sky-700">Comparison Otolith</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-64 border rounded overflow-hidden flex items-center justify-center bg-white">
                          <img src={comparePreview || compareResult.image?.previewUrl} alt="comparison otolith" className="object-contain max-h-full" />
                        </div>
                        <div className="mt-3 text-sm text-slate-700">
                          <div><strong>ID:</strong> {compareResult.otolithId}</div>
                          <div className="truncate"><strong>Species:</strong> {compareResult.metadata.scientificName}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Comparison summary */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Comparison Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-800">
                        <div>
                          <div><strong>Length diff:</strong> {morphoDiff(demoResult.morphometrics.length_mm, compareResult.morphometrics.length_mm)}</div>
                          <div><strong>Width diff:</strong> {morphoDiff(demoResult.morphometrics.width_mm, compareResult.morphometrics.width_mm)}</div>
                          <div><strong>Area diff:</strong> {morphoDiff(demoResult.morphometrics.area_mm2, compareResult.morphometrics.area_mm2)}</div>
                          <div><strong>Circularity diff:</strong> {morphoDiff(demoResult.morphometrics.circularity, compareResult.morphometrics.circularity)}</div>
                        </div>
                        <div>
                          <div><strong>Species match:</strong> {demoResult.metadata.scientificName === compareResult.metadata.scientificName ? "Same species" : "Different species"}</div>
                          <div className="mt-2"><strong>Primary voucher:</strong> <a className="text-sky-600 hover:underline" href={demoResult.provenance?.voucherUrl} target="_blank" rel="noreferrer">View record</a></div>
                          <div className="mt-1"><strong>Compare voucher:</strong> <a className="text-sky-600 hover:underline" href={compareResult.provenance?.voucherUrl} target="_blank" rel="noreferrer">View record</a></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Actions placed after data */}
              <div className="lg:col-span-2 mt-2">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="bg-white border-sky-100 text-sky-700"
                    onClick={() => {
                      const csv =
                        "field,value\n" +
                        "length_mm," + demoResult.morphometrics.length_mm + "\n" +
                        "width_mm," + demoResult.morphometrics.width_mm + "\n" +
                        "area_mm2," + demoResult.morphometrics.area_mm2 + "\n" +
                        "circularity," + demoResult.morphometrics.circularity
                      const blob = new Blob([csv], { type: "text/csv" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = "morphometrics.csv"
                      a.click()
                    }}
                  >
                    <FolderOutput className="h-4 w-4 mr-2" />
                    Export Morphometrics
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-white border-sky-100 text-sky-700"
                    onClick={() => { window.open(demoResult.provenance?.voucherUrl || "#", "_blank") }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Voucher Record
                  </Button>

                  <Button className="bg-sky-600 text-white ml-auto" onClick={() => alert("Flagged for curator review (demo)")}>
                    Flag for Review
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
