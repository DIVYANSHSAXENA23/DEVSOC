import './ResultDisplay.css'

export default function ResultDisplay({ result, loading, error }) {
  if (!result && !loading && !error) {
    return (
      <div className="result-container empty">
        <p>Submit your analysis to see results</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="result-container loading">
        <div className="spinner"></div>
        <p>Analyzing...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="result-container error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="result-container success">
      <div className="result-content">
        {result.prediction && (
          <div className="result-section">
            <h3>Prediction</h3>
            <p>{result.prediction}</p>
          </div>
        )}

        {result.risk_level && (
          <div className="result-section">
            <h3>Risk Level</h3>
            <p className={`risk-level risk-${result.risk_level.toLowerCase()}`}>
              {result.risk_level}
            </p>
          </div>
        )}

        {result.details && (
          <div className="result-section">
            <h3>Details</h3>
            <p>{result.details}</p>
          </div>
        )}

        {result.chart_url && (
          <div className="result-section">
            <h3>Analysis Chart</h3>
            <img src={result.chart_url} alt="Analysis chart" className="chart-image" />
          </div>
        )}
      </div>
    </div>
  )
}
