"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  Database,
  Brain,
  BarChart3,
  Search,
  Eye,
  Users,
  ArrowRight,
  Microscope,
  Map,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/input"

interface LandingPageProps {
  onLoginClick?: () => void
}

/** AnimatedNumber: smooth 0 → value animation using requestAnimationFrame */
const AnimatedNumber: React.FC<{ value: number; duration?: number; className?: string }> = ({ value, duration = 1600, className }) => {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (value === 0) {
      setDisplay(0)
      return
    }
    startRef.current = null
    const step = (t: number) => {
      if (!startRef.current) startRef.current = t
      const elapsed = t - startRef.current
      const prog = Math.min(1, elapsed / duration)
      const eased = Math.pow(prog, 0.65)
      const cur = Math.round(eased * value)
      setDisplay(cur)
      if (prog < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return <span className={className}>{display}</span>
}

export const Landing: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [taxonomyInput, setTaxonomyInput] = useState("")
  const [queryInput, setQueryInput] = useState("")
  const [taxonomyResult, setTaxonomyResult] = useState<string | null>(null)
  const [queryResult, setQueryResult] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // UI state for header elevation on scroll
  const [headerElevated, setHeaderElevated] = useState(false)

  // stats visibility
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLElement | null>(null)

  // hero video lazy load + reduced motion
  const heroRef = useRef<HTMLElement | null>(null)
  const [loadVideo, setLoadVideo] = useState(false)
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    const onScroll = () => {
      setHeaderElevated(window.scrollY > 16)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true)
            obs.disconnect()
          }
        })
      },
      { rootMargin: "0px 0px -10% 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) {
      setLoadVideo(false)
      return
    }
    const el = heroRef.current || document.getElementById("hero-section")
    if (!el) {
      const t = setTimeout(() => setLoadVideo(true), 800)
      return () => clearTimeout(t)
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadVideo(true)
            obs.disconnect()
          }
        })
      },
      { rootMargin: "300px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [prefersReducedMotion])

  const mockResults = useMemo(
    () =>
      ({
        "sardinella longiceps":
          "Family: Clupeidae\nGenus: Sardinella\nKingdom: Animalia\nPhylum: Chordata\nParent: Sardinella",
        "alectis indica": "Family: Carangidae\nGenus: Alectis\nKingdom: Animalia\nPhylum: Chordata\nParent: Alectis",
        "indian mackerel":
          "Family: Scombridae\nGenus: Rastrelliger\nKingdom: Animalia\nPhylum: Chordata\nParent: Rastrelliger",
      } as Record<string, string>),
    []
  )

  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ")

  const handleTaxonomyDemo = useCallback(async () => {
    if (!taxonomyInput.trim()) return
    setIsProcessing(true)
    setTimeout(() => {
      const key = normalize(taxonomyInput)
      const result = mockResults[key] || `${taxonomyInput} - Species classification requires full platform access`
      setTaxonomyResult(result)
      setIsProcessing(false)
    }, 1100)
  }, [taxonomyInput, mockResults])

  const handleQueryDemo = useCallback(async () => {
    if (!queryInput.trim()) return
    setIsProcessing(true)
    setTimeout(() => {
      const randomResults = [
        "Red mullet: A small, colorful fish prized for its delicate flavor in Mediterranean cuisine.",
        "Sardines: Small, oily fish found in large schools, rich in omega-3 fatty acids.",
        "Indian billfish: A fast, elongated predator known for its long bill and impressive speed.",
      ]
      const result = randomResults[Math.floor(Math.random() * randomResults.length)]
      setQueryResult(result)
      setIsProcessing(false)
    }, 900)
  }, [queryInput])

  const features = useMemo(
    () => [
      {
        icon: Database,
        title: "Unified Data Platform",
        description: "Access oceanographic, fisheries, and biodiversity data in one place",
      },
      {
        icon: Brain,
        title: "AI Classification",
        description: "Automated species identification and marine life classification",
      },
      {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "SST mapping, decision-making tools and predictive insights",
      },
      {
        icon: Eye,
        title: "Data Visualization",
        description: "Interactive 2D/3D visualizations and cross-domain analysis",
      },
      {
        icon: Search,
        title: "Smart Query Engine",
        description: "Natural language queries for complex data retrieval",
      },
      {
        icon: Users,
        title: "Collaborative Platform",
        description: "Multi-role access for scientists, researchers and data injectors",
      },
    ],
    []
  )

  const resultAnnouncement = taxonomyResult ? `Taxonomy result ready for ${taxonomyInput}` : queryResult ? `Query result ready` : isProcessing ? "Processing" : ""

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <style>{`
        :root{
          --cream: #fdf2df;
          --primary: #15609d;
          --teal: #008ca6;
          --cta: #0270e0;
          --white-hero: #ffffff;
          --text-dark: #111827;
          --muted: #6b7280;
        }

        /* header fixed at top full width (solid, no opacity) */
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 90;
          background: var(--white-hero);
          border-bottom: 1px solid rgba(0,0,0,0.04);
          transition: box-shadow .18s ease, transform .18s ease;
        }
        .site-header.elevated { box-shadow: 0 12px 36px rgba(2,6,23,0.08); transform: translateY(-1px); }
        .site-header .inner {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 12px 20px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .nav-links a { margin-right: 18px; color: var(--text-dark); font-weight:700; text-decoration:none; }
        .nav-links a:hover { text-decoration: underline; }

        /* shiny white heading rules — stronger, less faded highlight */
        .shiny-heading {
          position: relative;
          display: inline-block;
          -webkit-font-smoothing: antialiased;
          letter-spacing: -0.025em;

          /* keep main text bold white so it's always visible */
          color: #ffffff;

          /* create a high-contrast moving highlight using background-clip on a pseudo element */
          text-shadow: 0 10px 28px rgba(2,6,23,0.18);
        }

        /* the moving bright band (clipped to text using background-clip) */
        .shiny-heading::before {
          content: "";
          position: absolute;
          inset: 0;
          display: block;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.98) 45%,
            rgba(255,255,255,0.98) 55%,
            rgba(255,255,255,0) 100%
          );
          transform: skewX(-12deg);
          mix-blend-mode: screen;
          filter: blur(6px);
          pointer-events: none;
          opacity: 1; /* fully visible band */
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shiny-slide 1400ms linear infinite;
          /* clip the background to text glyphs on modern browsers */
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
        }

        @keyframes shiny-slide {
          0%   { background-position: -90% 0; transform: translateX(-40%) skewX(-12deg); }
          50%  { transform: translateX(0%) skewX(-12deg); }
          100% { background-position: 200% 0; transform: translateX(120%) skewX(-12deg); }
        }

        /* stats card style */
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.06);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .stat-card:hover { transform: translateY(-6px); box-shadow: 0 26px 60px rgba(2,6,23,0.08); }

        @media (max-width: 1024px) {
          .site-header .inner { padding: 10px 16px; }
        }
      `}</style>

      {/* HEADER: fixed at top, full-width solid color */}
      <header className={`site-header ${headerElevated ? "elevated" : ""}`} role="banner" aria-label="Main header">
        <div className="inner">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(2,6,23,0.06)" }}>
              <img src="/sidebarlogo.png" alt="logo" style={{ width: 34, height: 34, objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: "var(--primary)" }}>SagarGyaan</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>AI-Driven Ocean Data Platform</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <nav className="nav-links" aria-label="Primary navigation">
              <a href="#features">Features</a>
              <a href="#demo">Demo</a>
              <a href="#contact">Contact</a>
            </nav>

            <Button className="btn-primary" onClick={() => (onLoginClick ? onLoginClick() : (window.location.href = "/login"))} style={{ background: "linear-gradient(90deg,var(--teal),var(--cta))", color: "white", borderRadius: 8, padding: "8px 12px" }}>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <section id="hero-section" ref={heroRef} className="relative h-[100vh] w-full overflow-hidden" style={{ paddingTop: 88 }}>
        {loadVideo && !prefersReducedMotion ? (
          <video className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="metadata" poster="/waves-poster.jpg" aria-hidden="true">
            <source src="/videos/waves.mp4" type="video/mp4" />
          </video>
        ) : (
          <img className="absolute inset-0 h-full w-full object-cover" src="/waves-poster.jpg" alt="Ocean waves" />
        )}

        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.26), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.02) 100%)" }} />

        <div className="relative z-20 h-full w-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-extrabold shiny-heading"
            style={{
              lineHeight: 0.98,
              textAlign: "center",
              fontWeight: 900,
            }}
          >
            Unified Ocean
            <br />
            Intelligence
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.12 }} className="mt-6 text-white/90 text-lg md:text-xl max-w-3xl" style={{ lineHeight: 1.6, fontWeight: 700 }}>
            Harness the power of AI to unlock insights from oceanographic, fisheries, and biodiversity data. Make informed decisions for marine conservation and sustainable resource management across Indian Ocean waters.
          </motion.p>

          <div className="mt-8 flex gap-4">
            <Button onClick={() => (onLoginClick ? onLoginClick() : (window.location.href = "/login"))} style={{ background: "linear-gradient(90deg,var(--teal),var(--cta))", color: "white", borderRadius: 8, padding: "10px 16px" }}>
              Get Full Access <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => { const el = document.getElementById("features"); if (el) el.scrollIntoView({ behavior: "smooth" }) }} style={{ background: "white", color: "var(--text-dark)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 8, padding: "10px 16px", fontWeight: 700 }}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <main className="relative z-10">

        {/* Stats band on cream background */}
        <section ref={statsRef as any} className="py-14" style={{ backgroundColor: "var(--cream)" }}>
          <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              {[
                { value: 20, suffix: "+", label: "Datasets Processed", color: "#008ca6", dur: 1800 },
                { value: 48, suffix: "+", label: "Species Classified", color: "#15609d", dur: 2100 },
                { value: 3, suffix: "", label: "Active Projects", color: "#0270e0", dur: 1700 },
                { value: 98, suffix: "%", label: "AI Accuracy", color: "#008ca6", dur: 2400 },
              ].map((stat, i) => (
                <div key={i} className="stat-card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: stat.color }}>
                    {statsVisible ? <AnimatedNumber value={stat.value} duration={stat.dur} /> : 0}
                    {stat.suffix}
                  </div>
                  <div style={{ marginTop: 6, color: "var(--muted)", fontWeight: 700 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16" style={{ background: "var(--cream)" }}>
          <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: "var(--text-dark)", marginBottom: 8 }}>Platform Features</h2>
              <p style={{ color: "var(--muted)", fontWeight: 700 }}>Comprehensive tools for marine research and analysis</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div key={feature.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, delay: index * 0.06 }}>
                    <Card className="h-60" style={{ cursor: "pointer", background: "#ffffff" }}>
                      <CardContent className="p-6">
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ padding: 12, borderRadius: 9999, background: "rgba(21,96,157,0.06)" }}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 18, fontWeight: 900, color: "var(--text-dark)", marginBottom: 6 }}>{feature.title}</h3>
                            <p style={{ color: "var(--muted)", fontWeight: 700 }}>{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="py-16" style={{ background: "#ffffff" }}>
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: "var(--text-dark)", marginBottom: 8 }}>Try Our AI Features</h2>
              <p style={{ color: "var(--muted)", fontWeight: 700 }}>Experience the power of our AI-driven analysis tools</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Card style={{ background: "#ffffff" }}>
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ fontWeight: 800 }}>
                    <Microscope className="h-5 w-5 mr-2" />
                    Species Taxonomical Classification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ color: "var(--muted)", fontWeight: 700 }} className="text-sm">Enter a marine species name to see AI-powered taxonomic classification</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Input placeholder="e.g., sardinella longiceps" value={taxonomyInput} onChange={(e) => setTaxonomyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleTaxonomyDemo()} />
                      <Button onClick={handleTaxonomyDemo} disabled={!taxonomyInput.trim() || isProcessing}>{isProcessing ? "Processing..." : "Classify"}</Button>
                    </div>

                    {taxonomyResult && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ background: "rgba(60,125,170,0.06)", padding: 12, borderRadius: 8, border: "1px solid rgba(60,125,170,0.12)" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Microscope className="h-5 w-5" />
                          <div>
                            <div style={{ fontWeight: 800, color: "var(--primary)" }}>Classification Result:</div>
                            <div style={{ color: "var(--primary)" }} className="text-sm whitespace-pre-line">{taxonomyResult}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>* Limited species query only</div>
                  </div>
                </CardContent>
              </Card>

              <Card style={{ background: "#ffffff" }}>
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ fontWeight: 800 }}>
                    <Search className="h-5 w-5 mr-2" />
                    Smart Query Engine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ color: "var(--muted)", fontWeight: 700 }} className="text-sm">Ask questions about oceanographic data in natural language</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Input placeholder="e.g., give me an indian ocean fish..." value={queryInput} onChange={(e) => setQueryInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleQueryDemo()} />
                      <Button onClick={handleQueryDemo} disabled={!queryInput.trim() || isProcessing}>{isProcessing ? "Searching..." : "Query"}</Button>
                    </div>

                    {queryResult && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ background: "rgba(0,140,166,0.06)", padding: 12, borderRadius: 8, border: "1px solid rgba(0,140,166,0.12)" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Map className="h-5 w-5" />
                          <div>
                            <div style={{ fontWeight: 800, color: "var(--teal)" }}>Query Result:</div>
                            <div style={{ color: "var(--teal)" }} className="text-sm">{queryResult}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16" style={{ background: "linear-gradient(90deg,var(--teal),var(--cta))", color: "white" }}>
          <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Ready to Dive Deeper?</h2>
            <p style={{ opacity: 0.95, marginBottom: 16, fontWeight: 700 }}>Access the full platform for analysing species, visualisation tools, and comprehensive ocean data analysis.</p>
            <Button onClick={() => (onLoginClick ? onLoginClick() : (window.location.href = "/login"))} style={{ background: "white", color: "var(--teal)", padding: "10px 18px", fontWeight: 700 }}>
              Get Full Platform Access <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Footer (white, black text) */}
        <footer style={{ background: "#ffffff", color: "var(--text-dark)", padding: "44px 20px" }}>
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/sidebarlogo.png" alt="logo" style={{ width: 28, height: 28 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800 }}>SagarGyaan</div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>AI-driven platform for comprehensive ocean data analysis and marine research.</div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 800, marginBottom: 8 }}>Platform</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text-dark)" }}>
                <li>Data Analytics</li>
                <li>Species Classification</li>
                <li>Visualization Tools</li>
                <li>Natural Language Querying</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: 800, marginBottom: 8 }}>Support</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text-dark)" }}>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Demo Link</li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 28, color: "rgba(0,0,0,0.6)" }}>
            © 2025 SagarGyaan. Built for Smart India Hackathon 2025.
          </div>
        </footer>
      </main>

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {resultAnnouncement}
      </div>
    </div>
  )
}
