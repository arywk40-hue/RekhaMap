"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  CircleDot,
  CloudUpload,
  Crosshair,
  Database,
  Download,
  FileCheck2,
  Flag,
  Layers3,
  Map,
  MapPin,
  Menu,
  Mountain,
  Network,
  PanelLeftClose,
  Route,
  Satellite,
  Search,
  ShieldCheck,
  Sparkles,
  SquareDashedMousePointer,
  WandSparkles,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Parcel = {
  id: string;
  points: string;
  confidence: number;
  area: string;
  landUse: string;
  status: "approved" | "review" | "field";
  flags: string[];
  ownerRef: string;
};

const parcels: Parcel[] = [
  { id: "HP-MND-W14-0318", points: "74,70 228,48 254,166 94,178", confidence: 96, area: "412.8 m²", landUse: "Residential", status: "approved", flags: [], ownerRef: "LR-14/318" },
  { id: "HP-MND-W14-0319", points: "228,48 391,40 400,154 254,166", confidence: 88, area: "376.2 m²", landUse: "Mixed use", status: "review", flags: ["0.42 m overlap"], ownerRef: "LR-14/319" },
  { id: "HP-MND-W14-0320", points: "391,40 548,70 523,170 400,154", confidence: 93, area: "401.1 m²", landUse: "Residential", status: "approved", flags: [], ownerRef: "LR-14/320" },
  { id: "HP-MND-W14-0321", points: "94,178 254,166 276,305 105,326", confidence: 79, area: "455.4 m²", landUse: "Residential", status: "field", flags: ["Boundary obscured", "GT required"], ownerRef: "LR-14/321" },
  { id: "HP-MND-W14-0322", points: "254,166 400,154 420,288 276,305", confidence: 91, area: "389.7 m²", landUse: "Commercial", status: "review", flags: ["Access width < 3 m"], ownerRef: "LR-14/322" },
  { id: "HP-MND-W14-0323", points: "400,154 523,170 513,296 420,288", confidence: 97, area: "368.9 m²", landUse: "Residential", status: "approved", flags: [], ownerRef: "LR-14/323" },
];

const statusTone = {
  approved: "status-approved",
  review: "status-review",
  field: "status-field",
};

const layerConfig = [
  { key: "ori", label: "Drone ORI", icon: Satellite },
  { key: "parcels", label: "AI parcels", icon: SquareDashedMousePointer },
  { key: "buildings", label: "Buildings", icon: Building2 },
  { key: "roads", label: "Roads & paths", icon: Route },
  { key: "elevation", label: "DSM elevation", icon: Mountain },
] as const;

type LayerKey = (typeof layerConfig)[number]["key"];

export default function Home() {
  const [selectedId, setSelectedId] = useState("HP-MND-W14-0319");
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    ori: true,
    parcels: true,
    buildings: true,
    roads: true,
    elevation: false,
  });
  const [leftOpen, setLeftOpen] = useState(true);
  const [mapMode, setMapMode] = useState<"review" | "edit">("review");
  const [notice, setNotice] = useState<string | null>(null);

  const selected = useMemo(
    () => parcels.find((parcel) => parcel.id === selectedId) ?? parcels[0],
    [selectedId],
  );

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <button className="icon-button mobile-menu" aria-label="Toggle navigation" onClick={() => setLeftOpen((value) => !value)}>
            <Menu size={18} />
          </button>
          <div className="brand-mark" aria-hidden="true"><Crosshair size={19} /></div>
          <div>
            <div className="brand-name">RekhaMap <span>AI</span></div>
            <div className="brand-subtitle">Urban cadastral intelligence</div>
          </div>
        </div>

        <div className="survey-context">
          <span className="context-kicker">Active survey</span>
          <button className="context-button">
            Mandi · Ward 14 <ChevronRight size={15} />
          </button>
        </div>

        <div className="topbar-actions">
          <div className="system-status"><span /> Models online</div>
          <button className="outline-button" onClick={() => flash("Demo survey package queued for processing")}><CloudUpload size={16} /> New survey</button>
          <div className="avatar">AB</div>
        </div>
      </header>

      <Tabs defaultValue="review" className="workspace-tabs">
        <div className="tabbar">
          <TabsList variant="line" className="tab-list">
            <TabsTrigger value="review"><Map size={15} /> Map review</TabsTrigger>
            <TabsTrigger value="pipeline"><WandSparkles size={15} /> AI pipeline</TabsTrigger>
            <TabsTrigger value="field"><MapPin size={15} /> Field queue <span className="tab-count">4</span></TabsTrigger>
            <TabsTrigger value="exports"><Download size={15} /> Exports</TabsTrigger>
          </TabsList>
          <div className="processing-chip"><Sparkles size={14} /> Demo dataset · Tile A-03 processed in 02:41</div>
        </div>

        <TabsContent value="review" className="tab-panel">
          <div className={`review-layout ${leftOpen ? "" : "layers-collapsed"}`}>
            <aside className="layer-panel">
              <div className="panel-heading">
                <div><span className="eyebrow">Map composition</span><h2>Layers</h2></div>
                <button className="icon-button" aria-label="Collapse layers" onClick={() => setLeftOpen(false)}><PanelLeftClose size={17} /></button>
              </div>

              <div className="search-box"><Search size={15} /><input aria-label="Search parcel" placeholder="Search parcel ID" /></div>

              <div className="layer-group">
                <span className="group-label">Survey evidence</span>
                {layerConfig.map(({ key, label, icon: Icon }) => (
                  <label className="layer-row" key={key}>
                    <span className={`layer-icon layer-${key}`}><Icon size={15} /></span>
                    <span>{label}</span>
                    <Checkbox
                      aria-label={`Toggle ${label}`}
                      checked={layers[key]}
                      onCheckedChange={(checked) => setLayers((current) => ({ ...current, [key]: Boolean(checked) }))}
                    />
                  </label>
                ))}
              </div>

              <div className="layer-group">
                <span className="group-label">Quality filter</span>
                <div className="confidence-block">
                  <div><span>Minimum confidence</span><strong>75%</strong></div>
                  <div className="confidence-track"><span /></div>
                  <div className="confidence-scale"><span>50</span><span>100</span></div>
                </div>
              </div>

              <div className="tile-card">
                <div className="tile-icon"><Database size={16} /></div>
                <div><strong>Tile A-03</strong><span>2.4 cm GSD · 12.8 ha</span></div>
                <Check size={15} className="success-icon" />
              </div>
              <div className="datum-note"><CircleDot size={13} /> CRS: EPSG 32643 · WGS 84 / UTM 43N</div>
            </aside>

            <section className="map-workspace">
              {!leftOpen && <button className="floating-layers" onClick={() => setLeftOpen(true)}><Layers3 size={16} /> Layers</button>}
              <div className="map-toolbar">
                <div className="segmented-control" aria-label="Map interaction mode">
                  <button className={mapMode === "review" ? "active" : ""} onClick={() => setMapMode("review")}>Review</button>
                  <button className={mapMode === "edit" ? "active" : ""} onClick={() => setMapMode("edit")}>Edit vertices</button>
                </div>
                <div className="map-meta"><Crosshair size={14} /> 31.7061° N, 76.9336° E</div>
              </div>

              <div className={`cadastral-map ${layers.ori ? "ori-on" : ""} ${layers.elevation ? "elevation-on" : ""}`}>
                <div className="map-grid" />
                <svg viewBox="0 0 620 390" role="img" aria-label="Synthetic cadastral review map showing six AI-delineated parcels">
                  {layers.roads && (
                    <g className="road-layer">
                      <path d="M-20 362 C120 315 250 350 365 330 C475 310 540 327 650 292" />
                      <path d="M548 -20 C552 70 532 136 545 215 C550 255 570 302 590 415" />
                      <path className="access-path" d="M343 320 L332 166" />
                    </g>
                  )}

                  {layers.parcels && parcels.map((parcel) => {
                    const isSelected = selectedId === parcel.id;
                    return (
                      <g
                        key={parcel.id}
                        className={`parcel ${statusTone[parcel.status]} ${isSelected ? "is-selected" : ""}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select parcel ${parcel.id}, ${parcel.confidence}% confidence`}
                        onClick={() => setSelectedId(parcel.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") setSelectedId(parcel.id);
                        }}
                      >
                        <polygon points={parcel.points} />
                      </g>
                    );
                  })}

                  {layers.buildings && (
                    <g className="building-layer" aria-label="Detected building footprints">
                      <polygon points="111,93 194,80 205,137 122,147" /><polygon points="282,66 360,60 367,124 287,130" />
                      <polygon points="426,82 504,95 492,143 419,132" /><polygon points="129,207 224,195 235,277 141,291" />
                      <polygon points="291,192 378,181 388,252 301,264" /><polygon points="439,193 492,199 486,262 436,255" />
                    </g>
                  )}

                  <g className="map-labels">
                    <text x="135" y="118">0318</text><text x="315" y="98">0319</text><text x="457" y="118">0320</text>
                    <text x="165" y="251">0321</text><text x="335" y="225">0322</text><text x="463" y="230">0323</text>
                  </g>

                  {selected.flags.length > 0 && <circle className="issue-pulse" cx={selected.id.endsWith("319") ? 394 : selected.id.endsWith("321") ? 245 : 405} cy={selected.id.endsWith("319") ? 154 : selected.id.endsWith("321") ? 300 : 286} r="9" />}
                </svg>

                <div className="map-badge"><span>DEMO DATA</span> AI + existing GIS comparison</div>
                <div className="map-legend">
                  <span><i className="legend-line approved" /> High confidence</span>
                  <span><i className="legend-line review" /> Review</span>
                  <span><i className="legend-line field" /> Field check</span>
                </div>
                <div className="scale-bar"><span>0</span><div /><span>20 m</span></div>
              </div>

              <div className="map-stats">
                <div><span>Parcels extracted</span><strong>328</strong><em>+94% automated</em></div>
                <div><span>Building footprints</span><strong>214</strong><em>96.8% avg. confidence</em></div>
                <div><span>Topology flags</span><strong className="warning-text">17</strong><em>5.2% need review</em></div>
                <div><span>Processing coverage</span><strong>12.8 ha</strong><em>Tile A-03 complete</em></div>
              </div>
            </section>

            <aside className="inspection-panel">
              <div className="inspection-head">
                <div><span className="eyebrow">Selected parcel</span><h2>{selected.id.split("-").at(-1)}</h2></div>
                <span className={`review-status ${statusTone[selected.status]}`}>{selected.status === "field" ? "Field check" : selected.status}</span>
              </div>

              <div className="confidence-score">
                <div className="score-ring" style={{ "--score": `${selected.confidence * 3.6}deg` } as React.CSSProperties}>
                  <div><strong>{selected.confidence}</strong><span>%</span></div>
                </div>
                <div><strong>Boundary confidence</strong><span>{selected.confidence >= 90 ? "Strong image + GIS agreement" : selected.confidence >= 84 ? "One segment needs review" : "Field evidence recommended"}</span></div>
              </div>

              <dl className="parcel-details">
                <div><dt>Parcel ID</dt><dd>{selected.id}</dd></div>
                <div><dt>Record reference</dt><dd>{selected.ownerRef}</dd></div>
                <div><dt>Computed area</dt><dd>{selected.area}</dd></div>
                <div><dt>Land use</dt><dd>{selected.landUse}</dd></div>
              </dl>

              <div className="divider" />
              <div className="section-title"><span>Topology validation</span><span>{selected.flags.length} flag{selected.flags.length === 1 ? "" : "s"}</span></div>

              {selected.flags.length ? (
                <div className="issue-list">
                  {selected.flags.map((flag, index) => (
                    <button className="issue-card" key={flag} onClick={() => flash(`Zoomed to issue ${index + 1}: ${flag}`)}>
                      <span className="issue-icon"><AlertTriangle size={16} /></span>
                      <span><strong>{flag}</strong><em>{index === 0 ? "Geometry rule · high priority" : "Evidence rule · verify on site"}</em></span>
                      <ArrowUpRight size={15} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="clean-topology"><ShieldCheck size={18} /><span><strong>Topology clean</strong><em>No overlaps, gaps, or slivers detected</em></span></div>
              )}

              <div className="evidence-block">
                <div className="section-title"><span>Evidence agreement</span><span>4 sources</span></div>
                <div className="evidence-row"><span>Drone ORI edge</span><Progress value={selected.confidence} /><strong>{selected.confidence}%</strong></div>
                <div className="evidence-row"><span>Existing GIS layer</span><Progress value={Math.max(62, selected.confidence - 8)} /><strong>{Math.max(62, selected.confidence - 8)}%</strong></div>
                <div className="evidence-row"><span>DSM height break</span><Progress value={Math.max(58, selected.confidence - 13)} /><strong>{Math.max(58, selected.confidence - 13)}%</strong></div>
              </div>

              <div className="inspection-actions">
                <button className="primary-button" onClick={() => flash(`${selected.id} approved for preliminary map`)}><Check size={16} /> Approve parcel</button>
                <button className="secondary-button" onClick={() => flash(`${selected.id} added to GNSS field queue`)}><Flag size={16} /> Send to field</button>
              </div>
              <p className="legal-note"><ShieldCheck size={13} /> Preliminary output only. Final cadastral acceptance requires an authorized surveyor.</p>
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="tab-panel content-view">
          <div className="view-heading"><div><span className="eyebrow">Processing run · RM-2026-0830-014</span><h1>From drone pixels to reviewable parcels</h1><p>Every output is traceable to source evidence, model version, and validation rules.</p></div><button className="outline-button" onClick={() => flash("Run manifest downloaded")}><Download size={16} /> Run manifest</button></div>
          <div className="pipeline-grid">
            {[
              ["01", "Data alignment", "ORI, DSM, DTM, GIS and GNSS aligned to EPSG 32643", "Complete", Database],
              ["02", "Multi-task segmentation", "Parcel edges, buildings, roads and land-use masks", "Complete", WandSparkles],
              ["03", "Polygon reconstruction", "Vectorization, snapping, simplification and boundary fusion", "Complete", Network],
              ["04", "Topology engine", "Overlap, gap, sliver and access-rule validation", "17 flags", ShieldCheck],
              ["05", "Human review", "Confidence-ranked approval and GNSS field verification", "In progress", FileCheck2],
            ].map(([number, title, description, state, Icon], index) => {
              const StageIcon = Icon as typeof Database;
              return <article className="pipeline-card" key={String(number)}><div className="stage-top"><span className="stage-number">{number}</span><span className={`stage-state ${index < 3 ? "done" : index === 3 ? "flagged" : "active"}`}>{String(state)}</span></div><div className="stage-icon"><StageIcon size={22} /></div><h2>{String(title)}</h2><p>{String(description)}</p>{index < 4 && <ChevronRight className="stage-arrow" size={18} />}</article>;
            })}
          </div>
          <div className="model-panels">
            <section><div className="section-title"><span>Model ensemble</span><span>v0.8.2</span></div><div className="model-row"><div><strong>Boundary segmentation</strong><span>SegFormer + edge-aware decoder</span></div><b>mIoU 0.87</b></div><div className="model-row"><div><strong>Building extraction</strong><span>Mask2Former instance head</span></div><b>F1 0.94</b></div><div className="model-row"><div><strong>Road & access network</strong><span>DeepLabV3+ topology head</span></div><b>F1 0.91</b></div></section>
            <section><div className="section-title"><span>Run quality</span><span>12.8 ha</span></div><div className="quality-chart"><div style={{ height: "88%" }}><span>ORI</span></div><div style={{ height: "82%" }}><span>GIS</span></div><div style={{ height: "74%" }}><span>DSM</span></div><div style={{ height: "91%" }}><span>GT</span></div></div><p className="chart-note">Evidence completeness by source · no critical alignment failures</p></section>
          </div>
        </TabsContent>

        <TabsContent value="field" className="tab-panel content-view">
          <div className="view-heading"><div><span className="eyebrow">Ground verification</span><h1>Field queue</h1><p>Only ambiguous boundaries are sent to survey teams, ranked by risk and route proximity.</p></div><button className="primary-button" onClick={() => flash("Four assignments packaged for the field app")}><Route size={16} /> Optimize route</button></div>
          <div className="queue-summary"><div><strong>4</strong><span>Open assignments</span></div><div><strong>1.7 km</strong><span>Optimized route</span></div><div><strong>36 min</strong><span>Estimated field time</span></div><div><strong>2</strong><span>GNSS checkpoints</span></div></div>
          <div className="field-table" role="table" aria-label="Field verification assignments">
            <div className="table-row table-head" role="row"><span>Priority</span><span>Parcel</span><span>Reason</span><span>Evidence</span><span>Assignment</span><span>Status</span></div>
            {[
              ["P1", "HP-MND-W14-0321", "Boundary obscured", "ORI + GNSS", "Team North", "Ready"],
              ["P1", "HP-MND-W14-0344", "Record conflict", "GIS + CORS", "Team North", "Ready"],
              ["P2", "HP-MND-W14-0298", "Narrow access", "ORI + field photo", "Unassigned", "Open"],
              ["P3", "HP-MND-W14-0356", "Low edge score", "DSM + GNSS", "Unassigned", "Open"],
            ].map((row) => <button className="table-row" role="row" key={row[1]} onClick={() => flash(`${row[1]} opened in map review`)}>{row.map((cell, index) => <span key={cell} data-label={["Priority", "Parcel", "Reason", "Evidence", "Assignment", "Status"][index]} className={index === 0 ? "priority" : index === 5 ? "table-status" : ""}>{cell}</span>)}</button>)}
          </div>
        </TabsContent>

        <TabsContent value="exports" className="tab-panel content-view">
          <div className="view-heading"><div><span className="eyebrow">Interoperable delivery</span><h1>GIS-ready export center</h1><p>Versioned preliminary layers with provenance, confidence, and validation status attached.</p></div><span className="verified-chip"><ShieldCheck size={15} /> Topology checks included</span></div>
          <div className="export-grid">
            {[
              ["Parcel polygons", "328 features", "GeoJSON · Shapefile · GPKG", SquareDashedMousePointer],
              ["Building footprints", "214 features", "GeoJSON · Shapefile · DXF", Building2],
              ["Road & access network", "38 segments", "GeoJSON · GPKG", Route],
              ["QA & field package", "17 flags", "CSV · GeoPackage · PDF", FileCheck2],
            ].map(([title, count, formats, Icon]) => { const ExportIcon = Icon as typeof Database; return <article className="export-card" key={String(title)}><div className="export-icon"><ExportIcon size={20} /></div><div><h2>{String(title)}</h2><p>{String(count)}</p><span>{String(formats)}</span></div><button aria-label={`Export ${title}`} onClick={() => flash(`${title} export package prepared`)}><Download size={17} /></button></article>; })}
          </div>
          <section className="export-audit"><div><ShieldCheck size={22} /><span><strong>Survey audit package</strong><em>Source checksums, model card, CRS, run log, edit history and reviewer decisions</em></span></div><button className="outline-button" onClick={() => flash("Audit package prepared")}><Download size={16} /> Export audit bundle</button></section>
        </TabsContent>
      </Tabs>

      {notice && <div className="toast" role="status"><Check size={16} /> {notice}<button aria-label="Dismiss notification" onClick={() => setNotice(null)}><X size={14} /></button></div>}
    </main>
  );
}
