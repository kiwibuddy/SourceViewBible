#!/usr/bin/env python3
"""Build the Bible Societies partnership deck from the investor pitch template."""
import pathlib
import re

REPO = pathlib.Path(__file__).resolve().parent.parent
SRC = REPO / "presentation" / "pitch" / "index.html"
OUT = REPO / "presentation" / "bible-societies" / "index.html"


def strip_block(html: str, start_marker: str, end_marker: str) -> str:
    i = html.find(start_marker)
    j = html.find(end_marker)
    if i == -1 or j == -1 or j <= i:
        raise SystemExit(f"markers not found: {start_marker!r} -> {end_marker!r}")
    return html[:i] + html[j:]


NEW_AI_SECTION = """
  <!-- ===================================================== 17 · AI POSSIBILITIES DIVIDER -->
  <section class="slide photo" data-title="AI possibilities">
    <img class="bg" src="https://images.unsplash.com/photo-1475527588268-e6a157656e35?auto=format&fit=crop&w=1920&q=80" alt="" onerror="this.remove()">
    <div class="scrim scrim-l"></div>
    <div class="pad on-dark" style="height:100%;display:flex;flex-direction:column;justify-content:center;gap:22px;max-width:820px">
      <div class="eyebrow light rise">What becomes possible</div>
      <h2 class="h-xl rise d1">If structure meets<br><span class="serif-it" style="color:#ff6a5c">today’s technology.</span></h2>
      <p class="lead rise d2">We are not pitching a catalogue of products. We are inviting you to imagine what faithful Bible engagement could look like when AI tools are grounded in word-level metadata — and anchored to the original text behind every translation.</p>
    </div>
  </section>

  <!-- ===================================================== 18 · AI ENGAGEMENT -->
  <section class="slide" data-title="AI engagement">
    <div class="pad" style="display:flex;flex-direction:column;gap:22px;justify-content:center;height:100%">
      <div class="eyebrow rise">Scripture engagement, re-imagined</div>
      <h2 class="h-lg rise d1">Richer discovery without replacing the text.</h2>
      <div class="grid g2 rise d2" style="gap:18px">
        <div class="card"><h3 class="tint">Speaker-aware discovery</h3><p>Help readers find not just a topic but <i>who is speaking</i> — divine speech, prophetic voice, narrator frame — so engagement stays anchored in the text’s own drama.</p></div>
        <div class="card"><h3 class="tint">Sphere-guided journeys</h3><p>Map passages to the spheres of life readers actually inhabit — family, governance, education, celebration — supporting discipleship programs Bible Societies already run.</p></div>
        <div class="card"><h3 class="tint">Grounded AI companions</h3><p>LLM tools that cite verifiable spans (speaker · audience · monad range) instead of generating unattributed summaries — a trust layer for churches and translators.</p></div>
        <div class="card"><h3 class="tint">Oral &amp; communal reading</h3><p>Together-mode drama roles, audio with distinct voices per speaker, and sign-language-ready structure — aligned with UBS commitments to format diversity.</p></div>
      </div>
      <p class="small rise d3">These are directions for mutual exploration — built on metadata you could co-develop, not a fixed product roadmap imposed on partners.</p>
    </div>
  </section>

  <!-- ===================================================== 19 · ORIGINAL LANGUAGE ANCHOR -->
  <section class="slide" style="background:var(--paper-2)" data-title="Original language anchor">
    <div class="pad" style="display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center;height:100%">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="eyebrow rise">Sourced from the original text</div>
        <h2 class="h-md rise d1">Structure that travels with translation.</h2>
        <p class="lead rise d2">Attribution tags attach to <b>word positions</b>, not English phrasing. Align a new Bible Society translation to the monad map and the speaker, audience, and sphere layers re-attach — without re-tagging forty thousand hours of work.</p>
        <p class="lead rise d3">VerbView and CommandView (designed, not yet shipped) extend the same anchor to tense, mood, voice, and imperative structure — opening paths to original-language-aware tools alongside your Hebrew &amp; Greek resources.</p>
      </div>
      <div class="card rise d2" style="padding:24px">
        <h3 style="margin-bottom:12px">Partnership implication</h3>
        <p class="small" style="margin-bottom:10px"><b>1.</b> Your translation teams publish text + alignment.</p>
        <p class="small" style="margin-bottom:10px"><b>2.</b> SourceView structural layers inherit automatically.</p>
        <p class="small" style="margin-bottom:10px"><b>3.</b> Engagement tools — print, digital, audio, AI — share one verifiable backbone.</p>
        <p class="small"><b>4.</b> Original-language specialists validate tags at the source, strengthening trust across languages.</p>
      </div>
    </div>
  </section>

  <!-- ===================================================== 20 · TRANSLATION ROADMAP ALIGNMENT -->
  <section class="slide photo" data-title="Translation roadmap">
    <img class="bg" src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1920&q=80" alt="" onerror="this.remove()">
    <div class="scrim scrim-l"></div>
    <div class="pad on-dark" style="height:100%;display:flex;flex-direction:column;justify-content:center;gap:20px;max-width:900px">
      <div class="eyebrow light rise">Aligned with global Bible ministry</div>
      <h2 class="h-lg rise d1">Serving the same goals you already pursue.</h2>
      <div class="grid g2 rise d2" style="gap:14px">
        <div class="card" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)"><h3 style="color:#fff">Universal access</h3><p style="color:#cfd4d9">UBS aims for Scripture in every language and format — print, digital, audio, sign, braille. A portable structural layer multiplies each new translation’s engagement potential.</p></div>
        <div class="card" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)"><h3 style="color:#fff">1,200 translations by 2038</h3><p style="color:#cfd4d9">The Bible Translation Roadmap targets 600 million people. Tag-once metadata reduces the cost of building rich digital engagement for every language you finish.</p></div>
        <div class="card" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)"><h3 style="color:#fff">Deep engagement</h3><p style="color:#cfd4d9">“The Bible for Tomorrow” calls for lifelong encounter with Scripture — not distribution alone. Structure-first tools support reflection, community reading, and discipleship at word level.</p></div>
        <div class="card" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)"><h3 style="color:#fff">Church partnership</h3><p style="color:#cfd4d9">Interconfessional service to the global Church is your mandate. SourceView seeks co-development with Bible Societies — not parallel competition for the same mission.</p></div>
      </div>
      <p class="small rise d3" style="color:rgba(255,255,255,.55)">Goals drawn from United Bible Societies’ “Bible for Tomorrow” declaration and Translation Roadmap (2024–2026).</p>
    </div>
  </section>

"""


def main() -> None:
    html = SRC.read_text(encoding="utf-8")

    html = html.replace(
        "<title>SourceView — The Word, Fully Sourced · Investor & Developer Pitch</title>",
        "<title>SourceView — Partnership with Bible Societies · Mutual Development Brief</title>",
    )
    html = html.replace(
        'content="A new round of SourceView development: the world\'s only word-level Scripture intelligence platform."',
        'content="A partnership brief for Bible Societies: word-level Scripture metadata, translation-aligned tools, and AI-grounded engagement built together."',
    )

    # Remove investor product slides and appendix
    html = strip_block(
        html,
        "  <!-- ===================================================== 17 · SECTION DIVIDER PRODUCTS -->",
        "  <!-- ===================================================== 23 · BUSINESS MODEL -->",
    )
    html = strip_block(
        html,
        "  <!-- ===================================================== 28 · APPENDIX -->",
        "  </div><!-- /stage -->",
    )

    # Insert AI / partnership section before business model (now slide 17 area)
    html = html.replace(
        "  <!-- ===================================================== 23 · BUSINESS MODEL -->",
        NEW_AI_SECTION + "\n  <!-- ===================================================== 21 · BUSINESS MODEL -->",
    )

    # Renumber later section comments for clarity (optional cosmetic)
    html = html.replace("  <!-- ===================================================== 24 · ASSET RECOVERED -->", "  <!-- ===================================================== 22 · ASSET RECOVERED -->")
    html = html.replace("  <!-- ===================================================== 25 · ROADMAP -->", "  <!-- ===================================================== 23 · ROADMAP -->")
    html = html.replace("  <!-- ===================================================== 26 · THE ASK -->", "  <!-- ===================================================== 24 · PARTNERSHIP INVITATION -->")
    html = html.replace("  <!-- ===================================================== 27 · VISION CLOSE -->", "  <!-- ===================================================== 25 · VISION CLOSE -->")

    replacements = {
        # Cover
        """      <div class="badge light rise d1"><span class="dot"></span> 40,000 hours of original research</div>
      <h1 class="h-hero rise d2">The Word,<br><span class="serif-it tint" style="color:#ff6a5c">fully sourced.</span></h1>
      <p class="lead rise d3" style="max-width:620px">Re-launching the only Scripture platform with intelligence at the level of the <b style="color:#fff">individual word</b> — who is speaking, to whom, and in what sphere of life.</p>
      <p class="small rise d4" style="letter-spacing:.16em;text-transform:uppercase">A new round of development &nbsp;·&nbsp; Investor &amp; engineering brief &nbsp;·&nbsp; July 2026</p>""": """      <div class="badge light rise d1"><span class="dot"></span> Partnership brief · Bible Societies</div>
      <h1 class="h-hero rise d2">What if every new translation<br><span class="serif-it tint" style="color:#ff6a5c">carried the structure</span><br>of the original text?</h1>
      <p class="lead rise d3" style="max-width:680px">Imagining faithful Bible engagement when word-level metadata, your translations, and today’s AI tools are developed <b style="color:#fff">together</b> — not in isolation.</p>
      <p class="small rise d4" style="letter-spacing:.16em;text-transform:uppercase">SourceView × Bible Society partnership &nbsp;·&nbsp; July 2026</p>""",
        # Thesis
        """      <h2 class="h-xl rise" style="max-width:1000px">Every other Bible app stops at the <span class="serif-it">verse.</span></h2>
      <h2 class="h-xl rise d2" style="max-width:1000px;color:#ff6a5c">SourceView went all the way to the <span class="serif-it">word.</span></h2>
      <p class="lead rise d4" style="max-width:720px">One dataset, forty thousand hours in the making — and most of it has never shipped to a user.</p>""": """      <h2 class="h-xl rise" style="max-width:1000px">The global Church has never had<br>more ways to <span class="serif-it">encounter</span> Scripture.</h2>
      <p class="lead rise d2" style="max-width:780px">YouVersion, Bible Society apps, Logos, audio Bibles, sign-language Scripture — each has transformed access and engagement for millions. We celebrate that work.</p>
      <p class="lead rise d4" style="max-width:780px;color:#ff6a5c">SourceView asks a complementary question: <b style="color:#fff">what if the text itself</b> — who speaks, to whom, in what sphere — were structured data that every translation and tool could inherit?</p>""",
        # What it is subtitle
        """        <p class="small rise d4">Flagship of a six-tool suite: <b>SourceView Bible · Together · Web Reader · SphereView · VerbView · CommandView.</b></p>""": """        <p class="small rise d4">A reading experience designed for aloud, communal encounter — complementary to the distribution and study tools Bible Societies and partners already provide.</p>""",
        # Seven spheres footnote
        """      <p class="small rise d4">Coverage = share of biblical books containing tagged passages in each sphere. A classification system no competitor owns.</p>""": """      <p class="small rise d4">Coverage = share of biblical books containing tagged passages in each sphere — a taxonomy that can support engagement curricula Bible Societies already develop.</p>""",
        # Extended stack footnote
        """      <p class="small rise d3">Every layer compounds the moat — and every one can ground LLM tools with verifiable structure.</p>""": """      <p class="small rise d3">Every layer can ground engagement and AI tools with verifiable structure — and travel with your translations.</p>""",
        # Moat slide
        """        <div class="eyebrow rise">Why this wins in the AI era</div>
        <h2 class="h-md rise d1" style="color:#fff">Grounded by <span class="serif-it" style="color:#ff8a7d">construction</span>, not by restriction.</h2>
        <p class="lead rise d2">Every 2026 Bible-AI competitor fights the same enemy: hallucination on theological claims. Their defense is to <i>restrict</i> the model to cite outside commentaries.</p>
        <p class="lead rise d3">SourceView cites the text’s <b>own internal structure</b> — who actually spoke, to whom, in what context — span by span. Verifiable by design, and no one else has the layer.</p>""": """        <div class="eyebrow rise">Trust in the AI era</div>
        <h2 class="h-md rise d1" style="color:#fff">Grounded by <span class="serif-it" style="color:#ff8a7d">the text’s own structure.</span></h2>
        <p class="lead rise d2">AI assistants can enrich Bible engagement — but churches and translators rightly demand verifiable answers. Many tools cite commentaries or restrict model output.</p>
        <p class="lead rise d3">SourceView offers a different foundation: citations to the text’s <b>internal attribution</b> — speaker, audience, sphere — span by span, aligned to word positions that re-map to any translation you publish.</p>""",
        # Competitive matrix - full replace
        """      <div class="eyebrow rise">Where SourceView stands alone</div>
      <h2 class="h-lg rise d1">Nobody else tags the word.</h2>
      <table class="matrix rise d2">
        <thead><tr><th>Capability</th><th class="svh">SourceView</th><th>Logos</th><th>YouVersion</th><th>Dwell</th><th>Doxa</th></tr></thead>
        <tbody>
          <tr><td>Word-level speaker attribution</td><td class="sv yes">●</td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="no">—</td></tr>
          <tr><td>Live speaker / audience filtering</td><td class="sv yes">●</td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="no">—</td></tr>
          <tr><td>Sphere-of-society taxonomy</td><td class="sv yes">●</td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="no">—</td></tr>
          <tr><td>AI grounded in the text’s own structure</td><td class="sv yes">●</td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="no">—</td></tr>
          <tr><td>Structured attribution API</td><td class="sv yes">●</td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="no">—</td></tr>
        </tbody>
      </table>
      <p class="small rise d3">Logos &amp; Doxa converge on verifiability — but they cite external commentaries and testimonies. Only SourceView can cite the structure inside the verse.</p>""": """      <div class="eyebrow rise">A different kind of layer — not a replacement</div>
      <h2 class="h-lg rise d1">Built for a different question.</h2>
      <table class="matrix rise d2">
        <thead><tr><th>What readers need</th><th>What the ecosystem already excels at</th><th>What SourceView adds</th></tr></thead>
        <tbody>
          <tr><td>Daily access &amp; reading habits</td><td>YouVersion, Bible Society apps — extraordinary global reach</td><td class="sv">Speaker-colour drama reading · Together mode</td></tr>
          <tr><td>Study, libraries &amp; scholarship</td><td>Logos, Olive Tree — deep resources &amp; original languages</td><td class="sv">Word-level speaker · audience · sphere tags</td></tr>
          <tr><td>Audio &amp; immersive Scripture</td><td>Dwell, Bible.is, dramatized audio — beautiful listening</td><td class="sv">Per-speaker voice mapping from structure</td></tr>
          <tr><td>AI-assisted exploration</td><td>Growing AI Bible tools — helpful, rapidly improving</td><td class="sv">Grounding in text structure, not generated summary</td></tr>
          <tr><td>Translation &amp; publishing</td><td>Bible Societies — 70%+ of full Bible translations</td><td class="sv">Portable monad layer inheriting per translation</td></tr>
        </tbody>
      </table>
      <p class="small rise d3">Reference platforms named for clarity only. SourceView is engineered from the ground up for structural metadata — a complement to the tools your readers already trust.</p>""",
        # Business model -> partnership model
        """      <div class="eyebrow rise">How it makes money</div>
      <h2 class="h-lg rise d1">Two proven shapes, one unique asset.</h2>
      <div class="grid g2 rise d2">
        <div class="card"><h3 class="tint">Consumer · AI-attach on a habit tool</h3><p>Free reading &amp; devotionals; paid AI study, audio &amp; family tiers. Mirrors the Notion pattern — AI attach layered on a retained workflow, not sold standalone.</p></div>
        <div class="card"><h3 class="tint">Infrastructure · Freemium API + usage</h3><p>Free sandbox, metered paid tiers, and enterprise licenses to translators, publishers, media studios &amp; academic labs. The Langfuse/Helicone shape.</p></div>
      </div>
      <div class="grid g3 rise d3">
        <div class="card"><h3>Translation orgs</h3><p>License the layer so speaker/sphere tags transfer to each new language automatically.</p></div>
        <div class="card"><h3>Media &amp; studios</h3><p>Pre-solved character/voice breakdowns for audio drama, film &amp; games.</p></div>
        <div class="card"><h3>Seminaries &amp; labs</h3><p>A rare, publishable structured corpus for NLP &amp; digital-humanities research.</p></div>
      </div>""": """      <div class="eyebrow rise">Mutual development, not vendor lock-in</div>
      <h2 class="h-lg rise d1">A partnership model Bible Societies can shape.</h2>
      <div class="grid g2 rise d2">
        <div class="card"><h3 class="tint">Co-develop on your translations</h3><p>Align SourceView metadata to Bible Society text releases — you retain translation rights; we contribute structure, tools, and engineering.</p></div>
        <div class="card"><h3 class="tint">Shared engagement experiments</h3><p>Pilot AI-grounded reading plans, oral-drama tools, and sphere curricula together — measured against your engagement goals, not ours alone.</p></div>
      </div>
      <div class="grid g3 rise d3">
        <div class="card"><h3>Original-language validation</h3><p>Hebrew &amp; Greek specialists on your teams help verify tags at source — strengthening every downstream language.</p></div>
        <div class="card"><h3>Open structural exports</h3><p>JSON/CSV/API access for your digital teams — integrate with existing apps rather than replace them.</p></div>
        <div class="card"><h3>Revenue that serves mission</h3><p>Licensing structured for non-profit ministry: cost-recovery engineering, grant-funded pilots, and society-led distribution.</p></div>
      </div>""",
        # Roadmap
        """      <h2 class="h-lg rise d1" style="color:#fff">From recovery to platform.</h2>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px" class="rise d2">
        <div class="card" style="background:#1c242d;border-color:#2c3742"><div class="feat-ic" style="background:var(--sv-red)">1</div><h3 style="color:#fff">Recover</h3><p style="color:#aeb6bf">Extract &amp; verify the full dataset; publish clean JSON/CSV + schema.</p></div>
        <div class="card" style="background:#1c242d;border-color:#2c3742"><div class="feat-ic" style="background:var(--sv-green)">2</div><h3 style="color:#fff">Re-issue</h3><p style="color:#aeb6bf">Modern flagship reader with speaker filtering, on today’s stack.</p></div>
        <div class="card" style="background:#1c242d;border-color:#2c3742"><div class="feat-ic" style="background:var(--sv-blue)">3</div><h3 style="color:#fff">Expand</h3><p style="color:#aeb6bf">Ship VerbView, CommandView &amp; the AI study assistant; complete cross-translation.</p></div>
        <div class="card" style="background:#1c242d;border-color:#2c3742"><div class="feat-ic" style="background:var(--sph-celebration)">4</div><h3 style="color:#fff">Open</h3><p style="color:#aeb6bf">Launch the Attribution API &amp; licensing program — the platform tier.</p></div>
      </div>
      <p class="small rise d3">Sequenced so each phase funds and de-risks the next.</p>""": """      <h2 class="h-lg rise d1" style="color:#fff">A path we propose exploring together.</h2>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px" class="rise d2">
        <div class="card" style="background:#1c242d;border-color:#2c3742"><div class="feat-ic" style="background:var(--sv-red)">1</div><h3 style="color:#fff">Listen</h3><p style="color:#aeb6bf">Share metadata samples &amp; schema; learn your translation pipeline and engagement priorities.</p></div>
        <div class="card" style="background:#1c242d;border-color:#2c3742"><div class="feat-ic" style="background:var(--sv-green)">2</div><h3 style="color:#fff">Align</h3><p style="color:#aeb6bf">Pilot monad mapping on one society translation; validate with original-language consultants.</p></div>
        <div class="card" style="background:#1c242d;border-color:#2c3742"><div class="feat-ic" style="background:var(--sv-blue)">3</div><h3 style="color:#fff">Build</h3><p style="color:#aeb6bf">Co-create engagement tools — reading, AI discovery, oral drama — on your text &amp; your channels.</p></div>
        <div class="card" style="background:#1c242d;border-color:#2c3742"><div class="feat-ic" style="background:var(--sph-celebration)">4</div><h3 style="color:#fff">Scale</h3><p style="color:#aeb6bf">Extend across the Translation Roadmap — structure inherited by each new language you finish.</p></div>
      </div>
      <p class="small rise d3">Phases adapt to your society’s capacity — we seek co-authorship, not a fixed vendor timeline.</p>""",
        # Ask -> partnership invitation
        """      <div class="eyebrow rise">What a new round funds</div>
      <h2 class="h-lg rise d1">The team to unlock a 40,000-hour asset.</h2>
      <div class="grid g2 rise d2">
        <div class="card"><h3 class="tint">Product engineering</h3><p>Cross-platform app + web on a modern stack (Next.js / React Native), rebuilding the reader and Discovery Center on the recovered data.</p></div>
        <div class="card"><h3 class="tint">Data &amp; AI</h3><p>Complete the verb &amp; command layers, wire cross-translation alignment, and stand up the retrieval-grounded AI assistant.</p></div>
        <div class="card"><h3 class="tint">Platform &amp; API</h3><p>Ship the Attribution API, developer sandbox and licensing pipeline for translators, media &amp; academia.</p></div>
        <div class="card"><h3 class="tint">Go-to-market</h3><p>Re-launch to the existing audience, seed the API ecosystem, and open partner &amp; investor conversations.</p></div>
      </div>
      <p class="small rise d3">We are not starting from an idea. We are re-igniting a finished, defensible dataset the market has never fully seen.</p>""": """      <div class="eyebrow rise">An invitation</div>
      <h2 class="h-lg rise d1">Let’s explore mutual development.</h2>
      <div class="grid g2 rise d2">
        <div class="card"><h3 class="tint">Discovery conversation</h3><p>Walk your translation and digital teams through the metadata schema, recovery status, and alignment process — no commitment required.</p></div>
        <div class="card"><h3 class="tint">Pilot partnership</h3><p>Select one translation + one engagement use case (reading plan, AI discovery, oral drama) and co-fund a bounded proof of concept.</p></div>
        <div class="card"><h3 class="tint">Structural licensing</h3><p>Define terms that keep translation sovereignty with you while sharing structural IP for ministry impact.</p></div>
        <div class="card"><h3 class="tint">Original-language council</h3><p>Convene scholars from your network to validate speaker and sphere tags — strengthening the layer for every language.</p></div>
      </div>
      <p class="small rise d3">Forty thousand hours of structural work is ready. The question is who helps bring it to the languages and communities you already serve.</p>""",
        # GAP slide footnote
        """      <p class="small rise d4">Quotations/allusions + multilingual delivery = two more layers no competitor ships. Both integrate into the Attribution API and AI grounding stack.</p>""": """      <p class="small rise d4">Quotations/allusions plus multilingual delivery extend the structural stack — ready to integrate with Bible Society translations and engagement platforms you already operate.</p>""",
        # Transition slide
        """      <div class="eyebrow light rise">The part that never shipped</div>
      <h2 class="h-xl rise d1" style="max-width:1000px">The colors were only the <span class="serif-it" style="color:#ff6a5c">surface.</span></h2>
      <p class="lead rise d3" style="max-width:760px">Beneath them sits a structured, word-level database that no other Bible platform on earth possesses — and the first app exposed only a sliver of it.</p>""": """      <div class="eyebrow light rise">Beneath the reading experience</div>
      <h2 class="h-xl rise d1" style="max-width:1000px">The colors were only the <span class="serif-it" style="color:#ff6a5c">surface.</span></h2>
      <p class="lead rise d3" style="max-width:760px">Beneath them sits forty thousand hours of structured, word-level metadata — speaker, audience, sphere — recovered and ready to align with the translations Bible Societies publish.</p>""",
        """      <h2 class="h-xl rise d1" style="max-width:1000px">Experience the <span class="serif-it tint" style="color:#ff6a5c">Drama</span><br>of God's Story.</h2>
      <p class="lead rise d2" style="max-width:760px">A revolutionary suite of Bible tools — four colors, seven spheres, and 365 stories — built on the most trustworthy word-level Scripture data on earth. Recovered, verified, and ready to build on.</p>
      <div class="badge light rise d3"><span class="dot"></span> Let’s open the next round of development</div>""": """      <h2 class="h-xl rise d1" style="max-width:1000px">Scripture for <span class="serif-it tint" style="color:#ff6a5c">every language.</span><br>Engagement at the <span class="serif-it">word.</span></h2>
      <p class="lead rise d2" style="max-width:760px">Together we can link faithful translations to structure sourced from the original text — and open a new generation of discovery, community reading, and AI-grounded encounter with God’s Word.</p>
      <div class="badge light rise d3"><span class="dot"></span> sourceview.app · Let’s talk</div>""",
        # Counter placeholder (JS recalculates anyway)
        '<div class="chrome counter" id="counter">01 / 31</div>': '<div class="chrome counter" id="counter">01 / 28</div>',
    }

    for old, new in replacements.items():
        if old not in html:
            raise SystemExit(f"replacement block not found ({old[:60]}…)")
        html = html.replace(old, new)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    slide_count = len(re.findall(r'<section class="slide', html))
    print(f"Wrote {OUT.relative_to(REPO)} ({OUT.stat().st_size//1024} KB, {slide_count} slides)")


if __name__ == "__main__":
    main()
