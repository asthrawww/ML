import { useEffect, useState } from "react";
import "./App.css";


const API = "http://127.0.0.1:8000";


function App() {

  const [page, setPage] = useState("dashboard");

  const [dashboard, setDashboard] = useState(null);

  const [customers, setCustomers] = useState([]);

  const [segment, setSegment] = useState("All");

  const [search, setSearch] = useState("");

  const [recency, setRecency] = useState("");

  const [frequency, setFrequency] = useState("");

  const [monetary, setMonetary] = useState("");

  const [prediction, setPrediction] = useState("");

  const [loading, setLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(false);


  // --------------------------------
  // Load dashboard
  // --------------------------------

  const loadDashboard = async () => {

    try {

      const response =
        await fetch(
          `${API}/dashboard`
        );

      const data =
        await response.json();

      setDashboard(data);

    } catch (error) {

      console.error(error);

    }
  };


  // --------------------------------
  // Load customers
  // --------------------------------

  const loadCustomers = async () => {

    try {

      const response =
        await fetch(
          `${API}/customers?segment=${encodeURIComponent(segment)}&search=${encodeURIComponent(search)}`
        );

      const data =
        await response.json();

      setCustomers(data);

    } catch (error) {

      console.error(error);

    }
  };


  useEffect(() => {

    loadDashboard();

  }, []);


  useEffect(() => {

    if (page === "customers") {

      loadCustomers();

    }

  }, [page, segment]);


  // --------------------------------
  // Prediction
  // --------------------------------

  const predictCustomer = async () => {

    if (
      !recency ||
      !frequency ||
      !monetary
    ) {

      alert(
        "Please enter all RFM values"
      );

      return;

    }


    setLoading(true);

    setPrediction("");


    try {

      const response =
        await fetch(
          `${API}/predict`,
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              recency:
                Number(recency),

              frequency:
                Number(frequency),

              monetary:
                Number(monetary)

            })

          }
        );


      const data =
        await response.json();


      setPrediction(
        data.segment
      );


    } catch (error) {

      setPrediction(
        "Backend connection failed"
      );

    }


    setLoading(false);

  };


  // --------------------------------
  // Navigation
  // --------------------------------

  const navigation = [

    {
      id: "dashboard",
      icon: "⌂",
      name: "Dashboard"
    },

    {
      id: "prediction",
      icon: "✦",
      name: "Prediction"
    },

    {
      id: "analytics",
      icon: "◈",
      name: "Analytics"
    },

    {
      id: "customers",
      icon: "♙",
      name: "Customers"
    },

    {
      id: "about",
      icon: "ⓘ",
      name: "Model & Dataset"
    }

  ];


  return (

    <div
      className={
        darkMode
          ? "app dark"
          : "app"
      }
    >


      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            CS
          </div>

          <div>

            <h2>CustomerIQ</h2>

            <span>
              ML Analytics
            </span>

          </div>

        </div>


        <nav>

          {navigation.map(
            item => (

              <button
                key={item.id}
                className={
                  page === item.id
                    ? "nav-button active"
                    : "nav-button"
                }

                onClick={() =>
                  setPage(item.id)
                }
              >

                <span>
                  {item.icon}
                </span>

                {item.name}

              </button>

            )
          )}

        </nav>


        <div className="sidebar-bottom">

          <button
            className="theme-button"

            onClick={() =>
              setDarkMode(!darkMode)
            }
          >

            {darkMode
              ? "☀ Light Mode"
              : "☾ Dark Mode"}

          </button>

          <small>
            Customer Segmentation
            <br />
            Minor Project • 2026
          </small>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main">

        <header className="topbar">

          <div>

            <span className="top-label">
              RETAIL INTELLIGENCE
            </span>

            <h1>
              Customer Segmentation System
            </h1>

          </div>


          <div className="connection">

            <span></span>

            API Connected

          </div>

        </header>


        {/* ================= DASHBOARD ================= */}

        {page === "dashboard" && (

          <>

            <section className="hero">

              <div>

                <span className="top-label">
                  MACHINE LEARNING DASHBOARD
                </span>

                <h2>
                  Understand your customers
                  better.
                </h2>

                <p>
                  RFM-based customer
                  segmentation using
                  K-Means clustering.
                </p>

              </div>


              <div className="hero-badge">

                <strong>
                  K-MEANS
                </strong>

                <span>
                  3 CUSTOMER SEGMENTS
                </span>

              </div>

            </section>


            {dashboard && (

              <div className="stats-grid">

                <div className="stat">

                  <span>
                    Total Customers
                  </span>

                  <strong>
                    {dashboard.total_customers.toLocaleString()}
                  </strong>

                  <small>
                    RFM profiles
                  </small>

                </div>


                <div className="stat">

                  <span>
                    High Value
                  </span>

                  <strong>
                    {dashboard.high_value.toLocaleString()}
                  </strong>

                  <small>
                    Premium customers
                  </small>

                </div>


                <div className="stat">

                  <span>
                    Regular
                  </span>

                  <strong>
                    {dashboard.regular.toLocaleString()}
                  </strong>

                  <small>
                    Regular customers
                  </small>

                </div>


                <div className="stat">

                  <span>
                    Low Value
                  </span>

                  <strong>
                    {dashboard.low_value.toLocaleString()}
                  </strong>

                  <small>
                    Low activity customers
                  </small>

                </div>

              </div>

            )}


            {dashboard && (

              <section className="dashboard-grid">

                <div className="card">

                  <div className="card-title">

                    <div>

                      <h3>
                        Customer Distribution
                      </h3>

                      <p>
                        Distribution of learned
                        customer segments
                      </p>

                    </div>

                  </div>


                  <div className="segment-bars">

                    <div className="bar-item">

                      <div>

                        <span>
                          High Value
                        </span>

                        <b>
                          {dashboard.high_value}
                        </b>

                      </div>

                      <div className="bar">

                        <div
                          className="bar-high"
                          style={{
                            width:
                              `${Math.max(
                                5,
                                dashboard.high_value /
                                dashboard.total_customers *
                                100
                              )}%`
                          }}
                        />

                      </div>

                    </div>


                    <div className="bar-item">

                      <div>

                        <span>
                          Regular
                        </span>

                        <b>
                          {dashboard.regular}
                        </b>

                      </div>

                      <div className="bar">

                        <div
                          className="bar-regular"
                          style={{
                            width:
                              `${Math.max(
                                5,
                                dashboard.regular /
                                dashboard.total_customers *
                                100
                              )}%`
                          }}
                        />

                      </div>

                    </div>


                    <div className="bar-item">

                      <div>

                        <span>
                          Low Value
                        </span>

                        <b>
                          {dashboard.low_value}
                        </b>

                      </div>

                      <div className="bar">

                        <div
                          className="bar-low"
                          style={{
                            width:
                              `${Math.max(
                                5,
                                dashboard.low_value /
                                dashboard.total_customers *
                                100
                              )}%`
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>


                <div className="card">

                  <h3>
                    Average RFM Metrics
                  </h3>

                  <p className="muted">
                    Overall customer behaviour
                  </p>


                  <div className="rfm-cards">

                    <div>

                      <b>R</b>

                      <span>
                        Recency
                      </span>

                      <strong>
                        {dashboard.average_recency}
                      </strong>

                      <small>
                        days
                      </small>

                    </div>


                    <div>

                      <b>F</b>

                      <span>
                        Frequency
                      </span>

                      <strong>
                        {dashboard.average_frequency}
                      </strong>

                      <small>
                        purchases
                      </small>

                    </div>


                    <div>

                      <b>M</b>

                      <span>
                        Monetary
                      </span>

                      <strong>
                        £{dashboard.average_monetary.toLocaleString()}
                      </strong>

                      <small>
                        average spend
                      </small>

                    </div>

                  </div>

                </div>

              </section>

            )}


            <section className="feature-grid">

              <div className="feature">

                <div className="feature-icon">
                  R
                </div>

                <div>

                  <h3>
                    Recency
                  </h3>

                  <p>
                    How recently the customer
                    made a purchase.
                  </p>

                </div>

              </div>


              <div className="feature">

                <div className="feature-icon">
                  F
                </div>

                <div>

                  <h3>
                    Frequency
                  </h3>

                  <p>
                    How often the customer
                    makes purchases.
                  </p>

                </div>

              </div>


              <div className="feature">

                <div className="feature-icon">
                  M
                </div>

                <div>

                  <h3>
                    Monetary
                  </h3>

                  <p>
                    How much the customer
                    spends.
                  </p>

                </div>

              </div>

            </section>

          </>

        )}


        {/* ================= PREDICTION ================= */}

        {page === "prediction" && (

          <>

            <div className="page-heading">

              <span className="top-label">
                CUSTOMER PREDICTION
              </span>

              <h2>
                Predict Customer Segment
              </h2>

              <p>
                Enter RFM values to classify
                a new customer.
              </p>

            </div>


            <section className="prediction-grid">

              <div className="card form-card">

                <h3>
                  Customer RFM Profile
                </h3>


                <label>
                  Recency
                  <span>
                    Days since last purchase
                  </span>
                </label>

                <input
                  type="number"
                  value={recency}
                  placeholder="Example: 10"
                  onChange={e =>
                    setRecency(
                      e.target.value
                    )
                  }
                />


                <label>
                  Frequency
                  <span>
                    Number of purchases
                  </span>
                </label>

                <input
                  type="number"
                  value={frequency}
                  placeholder="Example: 20"
                  onChange={e =>
                    setFrequency(
                      e.target.value
                    )
                  }
                />


                <label>
                  Monetary
                  <span>
                    Total amount spent
                  </span>
                </label>

                <input
                  type="number"
                  value={monetary}
                  placeholder="Example: 5000"
                  onChange={e =>
                    setMonetary(
                      e.target.value
                    )
                  }
                />


                <button
                  className="primary-button"
                  onClick={
                    predictCustomer
                  }
                >

                  {loading
                    ? "Analyzing..."
                    : "Predict Customer Segment"}

                </button>

              </div>


              <div className="card prediction-result">

                {!prediction ? (

                  <>

                    <div className="result-icon">
                      ?
                    </div>

                    <h3>
                      Prediction Result
                    </h3>

                    <p>
                      Enter customer details
                      and click predict.
                    </p>

                  </>

                ) : (

                  <>

                    <div className="result-icon success">
                      ✓
                    </div>

                    <span className="top-label">
                      PREDICTED SEGMENT
                    </span>

                    <h2>
                      {prediction}
                    </h2>

                    <div className="prediction-summary">

                      <div>
                        <span>Recency</span>
                        <b>{recency}</b>
                      </div>

                      <div>
                        <span>Frequency</span>
                        <b>{frequency}</b>
                      </div>

                      <div>
                        <span>Monetary</span>
                        <b>£{monetary}</b>
                      </div>

                    </div>

                  </>

                )}

              </div>

            </section>

          </>

        )}


        {/* ================= ANALYTICS ================= */}

        {page === "analytics" && (

          <>

            <div className="page-heading">

              <span className="top-label">
                ANALYTICS
              </span>

              <h2>
                Customer Segment Analytics
              </h2>

              <p>
                Compare the three customer
                groups created by K-Means.
              </p>

            </div>


            {dashboard && (

              <>

                <div className="analytics-grid">

                  <div className="analytics-card high">

                    <span>
                      HIGH VALUE
                    </span>

                    <strong>
                      {dashboard.high_value}
                    </strong>

                    <p>
                      Customers with strong
                      purchasing behaviour.
                    </p>

                  </div>


                  <div className="analytics-card regular">

                    <span>
                      REGULAR
                    </span>

                    <strong>
                      {dashboard.regular}
                    </strong>

                    <p>
                      Customers with moderate
                      purchasing behaviour.
                    </p>

                  </div>


                  <div className="analytics-card low">

                    <span>
                      LOW VALUE
                    </span>

                    <strong>
                      {dashboard.low_value}
                    </strong>

                    <p>
                      Customers with lower
                      purchasing activity.
                    </p>

                  </div>

                </div>


                <div className="card">

                  <h3>
                    How the segments are formed
                  </h3>

                  <div className="comparison">

                    <div>

                      <strong>
                        High Value
                      </strong>

                      <p>
                        Lower Recency +
                        Higher Frequency +
                        Higher Monetary value
                      </p>

                    </div>


                    <div>

                      <strong>
                        Regular
                      </strong>

                      <p>
                        Moderate purchasing
                        activity across RFM.
                      </p>

                    </div>


                    <div>

                      <strong>
                        Low Value
                      </strong>

                      <p>
                        Higher Recency +
                        Lower Frequency +
                        Lower Monetary value
                      </p>

                    </div>

                  </div>

                </div>

              </>

            )}

          </>

        )}


        {/* ================= CUSTOMERS ================= */}

        {page === "customers" && (

          <>

            <div className="page-heading">

              <span className="top-label">
                CUSTOMER EXPLORER
              </span>

              <h2>
                Explore Customer Profiles
              </h2>

              <p>
                Search and filter customers
                from the RFM dataset.
              </p>

            </div>


            <div className="filter-row">

              <input
                placeholder="Search Customer ID"
                value={search}
                onChange={e =>
                  setSearch(
                    e.target.value
                  )
                }
              />


              <select
                value={segment}
                onChange={e =>
                  setSegment(
                    e.target.value
                  )
                }
              >

                <option>
                  All
                </option>

                <option>
                  High Value Customer
                </option>

                <option>
                  Regular Customer
                </option>

                <option>
                  Low Value Customer
                </option>

              </select>


              <button
                className="secondary-button"
                onClick={
                  loadCustomers
                }
              >

                Search

              </button>

            </div>


            <div className="card table-card">

              <div className="table-header">

                <h3>
                  Customer Profiles
                </h3>

                <span>
                  Showing up to 100
                </span>

              </div>


              <div className="table-container">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Customer ID
                      </th>

                      <th>
                        Recency
                      </th>

                      <th>
                        Frequency
                      </th>

                      <th>
                        Monetary
                      </th>

                      <th>
                        Segment
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {customers.map(
                      customer => (

                        <tr
                          key={
                            customer.customer_id
                          }
                        >

                          <td>
                            #
                            {
                              customer.customer_id
                            }
                          </td>

                          <td>
                            {
                              customer.recency
                            } days
                          </td>

                          <td>
                            {
                              customer.frequency
                            }
                          </td>

                          <td>
                            £
                            {
                              customer.monetary.toLocaleString()
                            }
                          </td>

                          <td>

                            <span
                              className={
                                customer.segment.includes(
                                  "High"
                                )
                                  ? "pill high"
                                  : customer.segment.includes(
                                      "Regular"
                                    )
                                  ? "pill regular"
                                  : "pill low"
                              }
                            >

                              {
                                customer.segment
                              }

                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </>

        )}


        {/* ================= ABOUT ================= */}

        {page === "about" && (

          <>

            <div className="page-heading">

              <span className="top-label">
                PROJECT INFORMATION
              </span>

              <h2>
                Model & Dataset
              </h2>

              <p>
                Technical overview of the
                Customer Segmentation system.
              </p>

            </div>


            <div className="about-grid">

              <div className="card">

                <h3>
                  Machine Learning Pipeline
                </h3>


                <div className="pipeline">

                  <div>
                    <b>01</b>
                    <span>
                      Retail<br />
                      Data
                    </span>
                  </div>

                  <i>→</i>

                  <div>
                    <b>02</b>
                    <span>
                      RFM<br />
                      Features
                    </span>
                  </div>

                  <i>→</i>

                  <div>
                    <b>03</b>
                    <span>
                      Scaling
                    </span>
                  </div>

                  <i>→</i>

                  <div>
                    <b>04</b>
                    <span>
                      K-Means
                    </span>
                  </div>

                  <i>→</i>

                  <div>
                    <b>05</b>
                    <span>
                      Segment
                    </span>
                  </div>

                </div>

              </div>


              <div className="card">

                <h3>
                  Project Technologies
                </h3>


                <div className="tech-list">

                  <div>
                    <span>Frontend</span>
                    <b>React + CSS</b>
                  </div>

                  <div>
                    <span>Backend</span>
                    <b>FastAPI</b>
                  </div>

                  <div>
                    <span>Machine Learning</span>
                    <b>K-Means</b>
                  </div>

                  <div>
                    <span>Features</span>
                    <b>RFM</b>
                  </div>

                  <div>
                    <span>Dataset</span>
                    <b>UCI Online Retail</b>
                  </div>

                  <div>
                    <span>Language</span>
                    <b>Python + JavaScript</b>
                  </div>

                </div>

              </div>

            </div>


            <div className="card rfm-explanation">

              <h3>
                RFM Analysis
              </h3>


              <div className="rfm-explanation-grid">

                <div>

                  <b>R</b>

                  <h4>
                    Recency
                  </h4>

                  <p>
                    Measures how recently
                    a customer purchased.
                  </p>

                </div>


                <div>

                  <b>F</b>

                  <h4>
                    Frequency
                  </h4>

                  <p>
                    Measures how frequently
                    the customer purchases.
                  </p>

                </div>


                <div>

                  <b>M</b>

                  <h4>
                    Monetary
                  </h4>

                  <p>
                    Measures the total amount
                    spent by the customer.
                  </p>

                </div>

              </div>

            </div>

          </>

        )}

      </main>

    </div>

  );

}


export default App;
