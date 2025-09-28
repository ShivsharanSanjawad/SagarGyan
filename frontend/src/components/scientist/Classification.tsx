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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100">
      {/* Top banner (background image removed per request) */}
      <div className="relative w-full h-44 flex items-center justify-center bg-sky-800">
        <div className="relative text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Classification Module</h1>
          <p className="mt-2 text-sm md:text-base text-sky-100">Identify and classify marine species using advanced techniques</p>
        </div>
      </div>

      {/* tabs */}
      <div className="w-full max-w-screen-2xl mx-auto -mt-8 px-6 relative z-20">
        <div className="flex w-full bg-white rounded-xl shadow-md overflow-hidden relative z-30">
          <Button
            variant="ghost"
            className={`flex-1 py-3 text-lg font-semibold ${activeModule === "edna" ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white" : "!text-gray-700 hover:text-sky-600"}`}
            onClick={() => setActiveModule("edna")}
          >
            eDNA Analysis
          </Button>

          <Button
            variant="ghost"
            className={`flex-1 py-3 text-lg font-semibold ${activeModule === "taxonomy" ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white" : "!text-gray-700 hover:text-sky-600"}`}
            onClick={() => setActiveModule("taxonomy")}
          >
            Taxonomy
          </Button>

          <Button
            variant="ghost"
            className={`flex-1 py-3 text-lg font-semibold ${activeModule === "otolith" ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white" : "!text-gray-700 hover:text-sky-600"}`}
            onClick={() => setActiveModule("otolith")}
          >
            Otolith Analysis
          </Button>
        </div>
      </div>

      {/* content area */}
      <div className="w-full max-w-screen-2xl mx-auto mt-8 px-6 space-y-6 pb-12">
        {/* eDNA module */}
        {activeModule === "edna" && (
          <>
            {/* Whole card uses background image (cover) so image fills entire card area */}
            <Card
              className="shadow-lg rounded-2xl hover:shadow-xl transition relative overflow-hidden w-full"
              style={{
                backgroundImage: "url('/background.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center right",
                backgroundSize: "cover",
              }}
            >
              {/* translucent overlay so text remains readable */}
              <div className="absolute inset-0 bg-white/88 md:bg-white/84 pointer-events-none" />

              <div className="relative z-10 p-6">
                {/* Upload + Analyze */}
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

                {/* Results area */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column: Top call + fasta snippet */}
                  <div className="lg:col-span-2 space-y-4">
                    <Card className="shadow-sm rounded-lg w-full">
                      <CardHeader>
                        <CardTitle className="text-sky-700">Top Call & Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {ednaResult ? (
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xs text-slate-500">Top Call</div>
                                <div className="text-2xl font-semibold text-slate-900">{getEdnaTop(ednaResult).call}</div>
                                {ednaResult.topHit?.description && <div className="text-sm text-slate-600 mt-1">{ednaResult.topHit.description}</div>}
                              </div>

                              <div className="text-right">
                                <div className="text-xs text-slate-500">Identity</div>
                                <div className="text-2xl font-bold text-sky-700">{ednaResult.topHit?.identityPct ?? "—"}%</div>
                                <div className="text-sm text-slate-400 mt-1">score: {ednaResult.topHit?.score ?? "—"}</div>
                                <div className="text-sm text-slate-400">e-value: {typeof ednaResult.topHit?.evalue !== "undefined" ? String(ednaResult.topHit.evalue) : "—"}</div>
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium">FASTA snippet (preview)</div>
                              <pre className="mt-2 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap max-h-48 overflow-auto bg-sky-50 rounded p-3">
                                {ednaFastaText ? ednaFastaText.split(/\r?\n/).slice(0, 12).join("\n") : ednaResult.query?.fastaSnippet || "No sequence snippet available."}
                              </pre>

                              <div className="mt-2 flex items-center gap-3">
                                <Button size="sm" variant="outline" onClick={() => {
                                  const txt = ednaFastaText ?? ednaResult.query?.fastaSnippet ?? ""
                                  const blob = new Blob([txt], { type: "text/plain" })
                                  const url = URL.createObjectURL(blob)
                                  const a = document.createElement("a")
                                  a.href = url
                                  a.download = `${ednaResult.sampleId ?? "edna_sequence"}.fasta`
                                  a.click()
                                }}>
                                  Export FASTA
                                </Button>

                                <div className="ml-auto flex gap-4 text-sm">
                                  {ednaResult.links?.ncbi && <a href={ednaResult.links.ncbi} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">NCBI</a>}
                                  {ednaResult.links?.pr2 && <a href={ednaResult.links.pr2} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">PR2</a>}
                                  {ednaResult.links?.gbif && <a href={ednaResult.links.gbif} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">GBIF</a>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-slate-500">Results will appear here after analysis.</div>
                        )}
                      </CardContent>
                    </Card>

                    {/* All Hits expanded: removed DB / Taxon ID / Coverage and removed "No description." */}
                    <Card className="shadow-sm rounded-lg w-full">
                      <CardHeader>
                        <CardTitle className="text-sky-700">All Hits (detailed)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {ednaResult && Array.isArray(ednaResult.hits) && ednaResult.hits.length > 0 ? (
                          <div className="space-y-3">
                            {ednaResult.hits.map((h: any, i: number) => (
                              <div key={i} className="p-3 border rounded-lg bg-white">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <div className="font-semibold text-lg text-slate-800">{h.species}</div>
                                    {/* Only show description if present */}
                                    {h.description && <div className="text-sm text-slate-500 mt-1">{h.description}</div>}
                                    <div className="text-sm text-slate-500 mt-1">Accession: <span className="font-mono">{h.accession ?? "—"}</span></div>
                                    {h.link && (
                                      <div className="mt-1">
                                        <a href={h.link} target="_blank" rel="noreferrer" className="text-sm text-sky-600 hover:underline">View record</a>
                                      </div>
                                    )}
                                  </div>

                                  <div className="text-right">
                                    <div className="text-lg font-semibold">{h.identityPct ?? h.identity ?? "—"}%</div>
                                    <div className="text-sm text-slate-400">score: {h.score ?? "—"}</div>
                                    <div className="text-sm text-slate-400 mt-1">e-value: {typeof h.evalue !== "undefined" ? String(h.evalue) : "—"}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500">No hits available. Run analysis to populate hits.</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right column: compact stats + provenance + quick actions */}
                  <div className="space-y-4">
                    <Card className="shadow-sm rounded-lg w-full">
                      <CardHeader>
                        <CardTitle className="text-sky-700">Provenance & Links</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {ednaResult ? (
                          <div className="text-sm text-slate-800 space-y-2">
                            <div><strong>Source:</strong> {ednaResult.source ?? "CMLRE / IndOBIS"}</div>
                            {ednaResult.license && <div><strong>License:</strong> {ednaResult.license}</div>}
                            {ednaResult.provenance && <div><a href={ednaResult.provenance} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">Provenance / record</a></div>}
                            <div className="mt-2"><strong>External:</strong></div>
                            <div className="flex flex-col gap-2 mt-1">
                              {ednaResult.links?.ncbi && <a href={ednaResult.links.ncbi} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline text-sm">NCBI record</a>}
                              {ednaResult.links?.pr2 && <a href={ednaResult.links.pr2} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline text-sm">PR2</a>}
                              {ednaResult.links?.gbif && <a href={ednaResult.links.gbif} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline text-sm">GBIF</a>}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-slate-600">External links and provenance will appear here once results are available.</div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm rounded-lg w-full">
                      <CardHeader>
                        <CardTitle className="text-sky-700">Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-slate-800 space-y-2">
                          <div><strong>Total reads:</strong> {ednaResult?.stats?.totalReads ?? "—"}</div>
                          <div><strong>Assigned:</strong> {ednaResult?.stats?.assignedReads ?? "—"}</div>
                          <div><strong>Unassigned:</strong> {ednaResult?.stats?.unassignedReads ?? "—"}</div>
                          <div><strong>Runtime:</strong> {ednaResult?.stats?.runtimeSec ? `${ednaResult.stats.runtimeSec}s` : "—"}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm rounded-lg w-full">
                      <CardHeader>
                        <CardTitle className="text-sky-700">Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            const txt = ednaFastaText ?? ednaResult?.query?.fastaSnippet ?? ""
                            const blob = new Blob([txt], { type: "text/plain" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = `${ednaResult?.sampleId ?? "edna_sequence"}.fasta`
                            a.click()
                          }}>Download FASTA</Button>

                          <Button size="sm" variant="outline" onClick={() => {
                            if (!ednaResult) return
                            const payload = {
                              sample: ednaResult.sampleId,
                              topCall: getEdnaTop(ednaResult).call,
                              stats: ednaResult.stats
                            }
                            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = `${ednaResult.sampleId ?? "edna"}_summary.json`
                            a.click()
                          }}>Export Summary (JSON)</Button>

                          <Button size="sm" className="bg-sky-600 text-white" onClick={() => alert("Flagged for curator review (demo)")}>Flag for Review</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* TAXONOMY */}
        {activeModule === "taxonomy" && (
          <div className="space-y-6">
            <Card className="shadow-lg rounded-2xl hover:shadow-xl transition">
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

        {/* OTOLITH */}
        {activeModule === "otolith" && (
          <div className="space-y-6 mt-8 relative overflow-hidden rounded-2xl"
            style={{
              backgroundImage: "url('/backgroundotlo.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right bottom",
              backgroundSize: "cover",
            }}
          >
            {/* overlay so background doesn't reduce readability */}
            <div className="absolute inset-0 bg-white/88 pointer-events-none" />
            <div className="relative z-10 p-6 space-y-6">
              <Card className="shadow-lg rounded-2xl hover:shadow-xl transition">
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
                    <p className="text-sm text-slate-500 mt-2">High-res JPG/PNG/TIFF preferred (scale bar preserved).</p>
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

              <Card className="shadow-lg rounded-2xl hover:shadow-xl transition">
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
                <div className="grid grid-cols-1 gap-4">
                  {/* Sample Information */}
                  <Card className="shadow-lg rounded-2xl">
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

                  <Card className="shadow-lg rounded-2xl">
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

                  <Card className="shadow-lg rounded-2xl">
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

                  {/* Compare flow + actions (present and functional) */}
                  {!compareResult && (
                    <Card className="shadow-lg rounded-2xl">
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

                  {compareResult && (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader><CardTitle className="text-sky-700">Primary Otolith</CardTitle></CardHeader>
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
                          <CardHeader><CardTitle className="text-sky-700">Comparison Otolith</CardTitle></CardHeader>
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

                      <Card>
                        <CardHeader><CardTitle className="text-sky-700">Comparison Summary</CardTitle></CardHeader>
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

                  <Card className="shadow-lg rounded-2xl">
                    <CardContent>
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
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}