"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/Button"
import { CustomInput } from "../ui/CustomInput"
import { Microscope, Upload, Search, FileText, FolderOutput, GitCompare } from "lucide-react"
import demoOtoliths from "../../data/demoData"
import demoDataEdna from "../../data/demoDataEdna" // ensure this file exists and exports demo record

export const Classification: React.FC = () => {
  const [activeModule, setActiveModule] = useState("edna")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [demoResult, setDemoResult] = useState<any | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Comparison state for otolith compare
  const [compareFile, setCompareFile] = useState<File | null>(null)
  const [comparePreview, setComparePreview] = useState<string | null>(null)
  const [compareResult, setCompareResult] = useState<any | null>(null)

  // eDNA-specific state
  const [ednaResult, setEdnaResult] = useState<any | null>(null)
  const [ednaFastaText, setEdnaFastaText] = useState<string | null>(null)

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

  // Animated percent state for otolith hierarchy bars
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

  // easing + animation helper (used for otolith hierarchical bars)
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

  // taxonomy search
  const handleTaxoSubmit = async () => {
    try {
      setIsAnalyzing(true)
      const response = await fetch(
        `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(uploadText)}`
      )
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
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

  // eDNA demo table (unchanged sample items)
  const classificationResults = [
    { id: 1, sample: "Sample_001", species: "Rastrelliger kanagurta", confidence: 95.2, method: "eDNA" },
    { id: 2, sample: "Sample_002", species: "Chelonia mydas", confidence: 87.8, method: "Morphology" },
    { id: 3, sample: "Sample_003", species: "Acropora cervicornis", confidence: 92.1, method: "Taxonomy" },
  ]

  // Generic file upload handler:
  // - images => previewUrl set
  // - FASTA/text => read text into ednaFastaText
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null
    if (!f) {
      setUploadedFile(null)
      setPreviewUrl(null)
      return
    }
    setUploadedFile(f)

    // revoke previous previews
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (comparePreview) URL.revokeObjectURL(comparePreview)

    const isImage = /\.(jpe?g|png|tiff?)$/i.test(f.name)
    if (isImage) {
      setPreviewUrl(URL.createObjectURL(f))
    } else {
      setPreviewUrl(null)
    }

    // reset prior results
    setDemoResult(null)
    setCompareFile(null)
    setComparePreview(null)
    setCompareResult(null)
    setEdnaResult(null)

    // if fasta-like file, read as text
    const isFasta = /\.(fa|fasta|seq|txt)$/i.test(f.name)
    if (isFasta) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = String(ev.target?.result ?? "")
        setEdnaFastaText(text)
      }
      reader.onerror = () => setEdnaFastaText(null)
      reader.readAsText(f)
    } else {
      setEdnaFastaText(null)
    }
  }

  // OTOLITH analyze (demo flow)
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

  // compare upload / analyze for otolith
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

  // eDNA analyze (demo) - use the hardcoded demoDataEdna entry
  const handleEdnaAnalyze = async () => {
    if (!uploadedFile && !ednaFastaText) {
      alert("Please upload a FASTA file first.")
      return
    }
    setIsAnalyzing(true)

    // ensure fasta text is read (if user uploaded but FileReader hasn't finished)
    if (!ednaFastaText && uploadedFile) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader()
        reader.onload = (ev) => {
          setEdnaFastaText(String(ev.target?.result ?? ""))
          resolve()
        }
        reader.onerror = () => resolve()
        reader.readAsText(uploadedFile)
      })
    }

    setTimeout(() => {
      // pick the demo edna record from demoDataEdna (key name depends on your demo file structure)
      const demo = demoDataEdna["demo_edna_fasta"] ?? demoDataEdna["demo_edna"] ?? Object.values(demoDataEdna)[0]
      setEdnaResult(demo)
      setIsAnalyzing(false)
    }, 600)
  }

  // small helper utils
  const morphoDiff = (a: number, b: number) => {
    if (a == null || b == null) return "—"
    if (a === 0) return "—"
    const diff = ((b - a) / a) * 100
    return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`
  }

  const openInMaps = (lat?: number, lon?: number) => {
    if (!lat || !lon) return
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
    window.open(url, "_blank")
  }

  // eDNA top call helper
  const getEdnaTop = (r: any) => {
    if (!r) return { call: "—", scorePct: 0 }
    const call = r.topHit?.species ?? r.topCall ?? "—"
    const rawScore = r.topHit?.identityPct ?? r.topScore ?? 0
    return { call, scorePct: typeof rawScore === "number" ? rawScore : 0 }
  }

  //
  // -------------------------- Tab slider logic + refs --------------------------
  //
  const tabs = [
    { key: "edna", label: "eDNA Analysis" },
    { key: "taxonomy", label: "Taxonomy" },
    { key: "otolith", label: "Otolith Analysis" },
  ]
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [sliderLeft, setSliderLeft] = useState(0)
  const [sliderWidth, setSliderWidth] = useState(0)

  // compute slider position (1s transition set in inline style below)
  const computeSlider = (active = activeModule) => {
    const idx = tabs.findIndex(t => t.key === active)
    const el = tabRefs.current[idx]
    const cont = containerRef.current
    if (!el || !cont) return
    const er = el.getBoundingClientRect()
    const cr = cont.getBoundingClientRect()
    // add small padding to make pill look inset like the screenshot
    const padding = 12
    setSliderLeft(er.left - cr.left + padding)
    setSliderWidth(er.width - padding * 2)
  }

  useEffect(() => {
    computeSlider()
    const onResize = () => computeSlider()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // animate for each activeModule change
    computeSlider()
    // small delay to ensure smoothing after layout changes
    const t = setTimeout(() => computeSlider(), 50)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModule])

  // ----------------------- End tab slider logic -----------------------

  return (
    <div className="min-h-screen bg-[#fdf2df]"> {/* cream background */}
      {/* top banner - narrow and clean like your screenshot */}
      <div className="max-w-screen-2xl mx-auto px-6 pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-white shadow-sm border">
            <Microscope className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Classification Module</h1>
            <p className="text-sm text-slate-600 mt-1">Identify and classify marine species using advanced techniques</p>
          </div>
        </div>

        {/* tab header container */}
        <div ref={containerRef} className="mt-6 relative bg-white rounded-full shadow-sm overflow-visible">
          {/* tab buttons row */}
          <div className="flex relative z-10">
            {tabs.map((t, i) => (
              <button
                key={t.key}
                ref={(el) => (tabRefs.current[i] = el)}
                onClick={() => setActiveModule(t.key)}
                className={`flex-1 py-3 px-6 text-center text-sm font-semibold transition-colors ${
                  activeModule === t.key
                    ? "text-white" // text becomes white on active pill
                    : "text-slate-700 hover:text-sky-600"
                }`}
                aria-pressed={activeModule === t.key}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* sliding pill - absolute, animated */}
          <div
            aria-hidden
            style={{
              left: sliderLeft,
              width: sliderWidth,
              transition: "transform 1s cubic-bezier(.2,.9,.3,1), width 1s cubic-bezier(.2,.9,.3,1), left 1s cubic-bezier(.2,.9,.3,1)",
            }}
            className="absolute top-1/2 -translate-y-1/2 h-[44px] rounded-full bg-gradient-to-r from-sky-600 to-sky-700 shadow-md pointer-events-none"
          />
        </div>
      </div>

      {/* content area - keep same layout but slightly padded like screenshot */}
      <div className="max-w-screen-2xl mx-auto -mt-4 px-6 pb-12">
        {/* preserve the rest of your page logic (eDNA / taxonomy / otolith) exactly */}
        {/* eDNA module */}
        {activeModule === "edna" && (
          <>
            {/* Whole card uses subtle white card inside cream page */}
            <div className="mt-6">
              <Card className="rounded-2xl shadow-lg overflow-hidden">
                <div className="relative z-10 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card className="shadow-sm rounded-lg w-full">
                        <CardHeader>
                          <CardTitle className="text-sky-700">Upload FASTA / sequence file</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border-2 border-dashed border-sky-300 rounded-xl p-6 bg-sky-50/30">
                            <div className="text-center">
                              <Upload className="h-12 w-12 mx-auto text-sky-400 mb-4" />
                              <label className="cursor-pointer">
                                <span className="text-base font-medium text-sky-600 hover:text-sky-800">Upload FASTA / sequence file</span>
                                <input type="file" onChange={handleFileUpload} className="sr-only" accept=".fasta,.fa,.seq,.txt" />
                              </label>
                              <p className="text-sm text-gray-500 mt-2">Supported: FASTA (.fasta, .fa), plain sequence text.</p>
                            </div>
                          </div>

                          {uploadedFile && (
                            <div className="flex items-center space-x-2 text-sm bg-green-50 p-3 rounded-lg mt-3">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-green-800 truncate">{uploadedFile.name}</span>
                              <div className="ml-auto">
                                <Button size="sm" variant="outline" onClick={() => { setUploadedFile(null); setEdnaFastaText(null); setEdnaResult(null) }}>Remove</Button>
                              </div>
                            </div>
                          )}

                          <div className="mt-3">
                            <Button className="bg-gradient-to-r from-sky-500 to-sky-700 text-white" onClick={handleEdnaAnalyze} disabled={!uploadedFile || isAnalyzing}>
                              {isAnalyzing ? "Analyzing..." : "Analyze eDNA"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="lg:col-span-1">
                      <Card className="shadow-sm rounded-lg w-full">
                        <CardHeader>
                          <CardTitle className="text-sky-700">Run summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {ednaResult ? (
                            <div className="text-sm text-slate-800 space-y-2">
                              <div><strong>Sample:</strong> {ednaResult.sampleId ?? "—"}</div>
                              <div><strong>Marker gene:</strong> {ednaResult.markerGene ?? "—"}</div>
                              <div><strong>Query acc.:</strong> <span className="font-mono">{ednaResult.query?.accession ?? "—"}</span></div>
                              <div><strong>Length:</strong> {ednaResult.query?.length ? `${ednaResult.query.length} bp` : "—"}</div>
                              <hr className="my-2" />
                              <div className="text-xs text-slate-600">Stats</div>
                              <div className="mt-1 text-sm">
                                <div><strong>Total reads:</strong> {ednaResult.stats?.totalReads ?? "—"}</div>
                                <div><strong>Assigned reads:</strong> {ednaResult.stats?.assignedReads ?? "—"}</div>
                                <div><strong>Unassigned reads:</strong> {ednaResult.stats?.unassignedReads ?? "—"}</div>
                                <div><strong>Runtime:</strong> {ednaResult.stats?.runtimeSec ? `${ednaResult.stats.runtimeSec}s` : "—"}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-slate-600">
                              Upload a FASTA and click Analyze to see results summary here.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* results & other cards kept same as your prior code */}
                  {/* ... (for brevity: reuse the rest of your existing eDNA result cards and otolith cards) */}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* TAXONOMY */}
        {activeModule === "taxonomy" && (
          <div className="mt-6">
            {/* keep your taxonomy card layout but wrapped in white card inside cream page */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-sky-700">Species Database Search</CardTitle>
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
                    <div className="border rounded-lg p-4 bg-white">
                      <h3 className="font-semibold">{speciesInfo.name}</h3>
                      <p className="text-sm text-gray-600 italic">{speciesInfo.name}</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <p><strong>Family:</strong> {speciesInfo.family}</p>
                        <p><strong>Genus:</strong> {speciesInfo.genus}</p>
                        <p><strong>Kingdom:</strong> {speciesInfo.kingdom}</p>
                      </div>
                      <Button size="sm" variant="outline" className="mt-3 bg-transparent">View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* OTOLITH */}
        {activeModule === "otolith" && (
          <div className="mt-6">
            {/* reuse your otolith flow unchanged, wrapped into white cards for consistent style */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-sky-700">Otolith Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-sky-200 rounded-md p-6 text-center">
                  <Upload className="h-10 w-10 mx-auto text-sky-400" />
                  <label className="cursor-pointer block mt-4 text-sky-700 font-medium">
                    <span>Upload Otolith Image</span>
                    <input type="file" onChange={handleFileUpload} className="sr-only" accept=".jpg,.jpeg,.png,.tiff" />
                  </label>
                  <p className="text-sm text-slate-500 mt-2">High-res JPG/PNG/TIFF preferred (scale bar preserved).</p>
                </div>

                {uploadedFile && (
                  <div className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-md p-3 text-sm mt-4">
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

                <div className="mt-4">
                  <Button onClick={handleAnalyze} disabled={!uploadedFile || isAnalyzing} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                    {isAnalyzing ? "Analyzing..." : "Analyze Otolith"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Classification
