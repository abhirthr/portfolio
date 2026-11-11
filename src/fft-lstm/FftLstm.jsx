import { useState } from 'react'
import Footer from '../components/Footer'
import Lightbox from '../components/ui/lightbox'
import Section from '../case-study/Section'
import { OverallChart, SeasonChart, RuntimeChart, LiteratureChart, FrequencyGroups } from './charts'
import { DOI, SITES, FIGURES } from './data'
import '../case-study/CaseStudy.css'
import './FftLstm.css'

const stages = [
  { tag: 'A', title: 'Collect', text: 'Hourly GHI and weather for four sites from the NSRDB, 2005–2014' },
  { tag: 'B', title: 'Clean & select', text: 'Fix gaps and outliers, keep features by correlation with GHI, normalise' },
  { tag: 'C', title: 'Decompose', text: 'NA-MEMD splits the multivariate series into 14–15 IMFs' },
  { tag: 'D', title: 'Reduce', text: 'FFT finds each IMF’s dominant frequency; IMFs regroup into 5 signals' },
  { tag: 'E', title: 'Window', text: 'Rolling window: yesterday’s 11 sunshine hours in, tomorrow’s 11 out' },
  { tag: 'F', title: 'Forecast', text: 'One tuned AM-LSTM per signal, per site' },
  { tag: 'G', title: 'Recombine', text: 'The 5 signal forecasts add up to tomorrow’s GHI' },
]

function FftLstm() {
  const [open, setOpen] = useState(null)
  const closeLightbox = () => setOpen(null)

  return (
    <>
      <header className="cs-top">
        <a href="/#research" className="cs-top__back">Back to portfolio</a>
        <a href="/" className="cs-top__logo">A.R.</a>
      </header>

      <main>
        <section className="cs-hero night">
        <div className="container">
          <p className="cs-eyebrow">Case study, Renewable Energy (Elsevier), 2025</p>
          <h1 className="cs-hero__title fl-title">Day-ahead solar forecasting with FFT-assisted LSTM</h1>
          <p className="cs-hero__lead">
            Splitting a weather series into its frequency components makes it easier for a neural
            network to forecast, but it can produce 15 components, which means 15 networks to train.
            This paper groups them by dominant frequency into 5 signals with a Fast Fourier
            Transform. The result is more accurate and takes less than half the training time.
          </p>
          <div className="cs-hero__actions">
            <a className="btn btn--primary" href={DOI} target="_blank" rel="noopener noreferrer">
              Read the paper
            </a>
            <a className="btn" href="#results">Jump to results</a>
          </div>

          <dl className="cs-meta">
            <div><dt>Role</dt><dd>First author: software, data curation, analysis, validation, figures, first draft</dd></div>
            <div><dt>Model</dt><dd>NA-MEMD decomposition, FFT grouping, attention-based LSTM per signal</dd></div>
            <div><dt>Data</dt><dd>NSRDB (SUNY model), hourly, 10 km, 2005–2014, four Indian sites</dd></div>
            <div><dt>Stack</dt><dd>Python, Keras + TensorFlow, Keras Tuner, scikit-learn, Matplotlib</dd></div>
          </dl>

        <div className="cs-kpis">
          <div className="cs-kpi"><span className="cs-kpi__value t-display">62.97</span><span className="cs-kpi__label">W/m² mean RMSE over four sites (nRMSE 6.33%, R 0.972)</span></div>
          <div className="cs-kpi"><span className="cs-kpi__value t-display">−36.9%</span><span className="cs-kpi__label">mean RMSE vs the same attention-LSTM without decomposition</span></div>
          <div className="cs-kpi"><span className="cs-kpi__value t-display">−13.0%</span><span className="cs-kpi__label">mean RMSE vs decomposition without the FFT step</span></div>
          <div className="cs-kpi"><span className="cs-kpi__value t-display">−58.8%</span><span className="cs-kpi__label">training time vs that model: 876 s instead of 2128 s</span></div>
        </div>
        </div>
        </section>

        <div className="cs-body day">
        <div className="container">
        <Section num="01" title="The problem">
          <p>
            Load dispatch centres schedule solar plants a day ahead, and plant operators bid into the
            day-ahead market, so both need tomorrow’s output hour by hour. Deep networks do well
            one step ahead, but errors grow when they must forecast a whole day at once, because
            irradiance is non-stationary and nonlinear.
          </p>
          <p>
            Decomposition helps: break the series into simpler oscillating parts (intrinsic mode
            functions, IMFs), forecast each and add them back. Earlier work with noise-assisted
            multivariate EMD (NA-MEMD) did exactly this, but needed a separate model for every IMF,
            which is slow and complex.
          </p>
        </Section>

        <Section num="02" title="The key idea: group components by frequency">
          <p>
            Many IMFs carry similar information. An FFT of each IMF gives its <strong>dominant
            frequency</strong>, and IMFs in the same frequency band are summed into one signal. The
            fast, noisy band is the hardest to predict, so it keeps three signals; slow modes are
            pooled. Five networks instead of fifteen, and each sees a cleaner pattern.
          </p>
          <FrequencyGroups />
        </Section>

        <Section num="03" title="Pipeline">
          <ol className="fl-stages">
            {stages.map((s) => (
              <li key={s.tag}>
                <span className="fl-stages__tag">{s.tag}</span>
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
          <p>
            Each AM-LSTM has an input layer, one to three hidden LSTM layers, an attention layer that weights
            the hidden states by relevance, a dense layer and an output layer. Layer counts and widths
            were tuned separately for all 20 networks (5 signals × 4 sites).
          </p>
        </Section>

        <Section num="04" title="Data and set-up">
          <div className="fl-sites">
            {SITES.map((s) => (
              <div key={s.name} className="fl-site">
                <strong>{s.name}</strong>
                <span>{s.state}, {s.lat}, {s.lon}</span>
                <em>{s.climate}</em>
              </div>
            ))}
          </div>
          <ul className="cs-list">
            <li><strong>Inputs.</strong> Temperature, relative humidity, wind speed, wind direction and solar zenith angle; the target is global horizontal irradiance (GHI).</li>
            <li><strong>Sunshine hours.</strong> 11 values a day, 07:00–17:00, at every site.</li>
            <li><strong>No leakage from decomposition.</strong> The ten years are split 50/50 into train and test, and NA-MEMD runs on each half separately so test data never shapes the training IMFs. Noise amplitude is set from the training half only (0.2 × its standard deviation).</li>
            <li><strong>Decomposition settings.</strong> 2–3 noise channels per site, 64 projections; 15 IMFs at three sites, 14 at Charanka.</li>
            <li><strong>Training.</strong> Adam, learning rate 0.0001, batch 64, up to 100 epochs with early stopping on validation loss. Test windows don’t overlap, so every forecast hour is scored once.</li>
            <li><strong>Baselines.</strong> Random forest, plain LSTM, AM-LSTM on the raw series, and N-AM-LSTM (decomposition, one network per IMF, no FFT).</li>
          </ul>
        </Section>

        <Section num="05" title="Results" id="results">
          <OverallChart />
          <SeasonChart />
          <div className="cs-grid-2">
            <RuntimeChart />
            <LiteratureChart />
          </div>
          <ul className="cs-list">
            <li><strong>Monsoon holds up.</strong> The hardest season for every model, but the proposed model’s RMSE stays between 55.7 and 90.29 W/m² across sites. At the worst site, N-AM-LSTM reaches 107.39 and the models without decomposition 134.78–146.79.</li>
            <li><strong>41 of 48.</strong> Across 4 seasons × 4 sites × 3 metrics, the proposed model is best in 41 cases.</li>
            <li><strong>Error spread.</strong> 80% of forecast hours fall within 0–50 W/m² of the truth at Kamuthi and Chikkoppa, and within 0–60 W/m² at Jodhpur and Charanka.</li>
            <li><strong>Hour by hour.</strong> Over 76% of forecast hours have a percentage error under 20%, and over 60% under 10%.</li>
          </ul>
        </Section>

        <Section num="06" title="Where it falls short">
          <ul className="cs-list">
            <li><strong>Charanka.</strong> Six of the seven seasonal exceptions are here: N-AM-LSTM has the lower RMSE in summer (46.8 vs 49.4 W/m²) and winter (32.69 vs 44.79). The paper points to site geography, local weather and data quality as possible causes, without settling it.</li>
            <li><strong>Correlation, not just error.</strong> At Jodhpur and Charanka the overall R is marginally higher for N-AM-LSTM (0.9712 vs 0.9708; 0.9751 vs 0.9695), even though the proposed model has the lower RMSE.</li>
            <li><strong>Sunset hours.</strong> Under 9% of hours have a percentage error above 50%, likely near sunset, where GHI is so low that small absolute errors look large.</li>
            <li><strong>Modelled data.</strong> Inputs and truth are NSRDB satellite-model values at 10 km, not plant measurements.</li>
            <li><strong>Decomposition still costs time.</strong> NA-MEMD takes 398 s per half of the data, and the models are site-specific: a new site means new decomposition and tuning.</li>
          </ul>
        </Section>

        <Section num="07" title="Figures from the paper">
          <div className="fl-figures">
            {FIGURES.map((f) => (
              <button key={f.src} className="fl-figure" onClick={() => setOpen(f)}>
                <img src={f.src} alt={f.caption} loading="lazy" />
                <span>{f.caption}</span>
              </button>
            ))}
          </div>
          <p className="fl-credit">
            Figures from Rathore, Gupta, Sharma &amp; Singh, <em>Renewable Energy</em> 247 (2025) 123021,
            © Elsevier, reproduced by the author. Charts on this page are redrawn from the paper’s tables.
          </p>
        </Section>

        <Section num="08" title="What came next">
          <p>
            The authors’ patent on machine-learning PV power forecasting, pending when the paper came out,
            was granted on 16 Feb 2026 (Indian Patent No. 580682; patentee iHUB DivyaSampark, IIT Roorkee). A separate project takes a
            different route to forecasting across India: one gradient-boosted model that corrects free
            weather forecasts with satellite data.
          </p>
          <div className="cs-hero__actions">
            <a className="btn" href="/#research">Patent details</a>
            <a className="btn" href="/projects/india-renewables-forecast/">India Renewables Forecast case study</a>
          </div>
        </Section>

        <div className="fl-cite">
          <p className="fl-cite__label">Cite this paper</p>
          <p>
            A. Rathore, P. Gupta, R. Sharma, R. Singh. Day ahead solar forecast using long short term
            memory network augmented with Fast Fourier transform-assisted decomposition technique.
            <em> Renewable Energy</em> 247 (2025) 123021.{' '}
            <a href={DOI} target="_blank" rel="noopener noreferrer">doi:10.1016/j.renene.2025.123021</a>
          </p>
        </div>

        <div className="cs-end">
          <a className="btn btn--primary" href={DOI} target="_blank" rel="noopener noreferrer">
            Read the paper
          </a>
          <a className="btn" href="/#research">Back to portfolio</a>
        </div>
        </div>
        </div>
      </main>

      <Footer />
      <Lightbox item={open} onClose={closeLightbox} />
    </>
  )
}

export default FftLstm
