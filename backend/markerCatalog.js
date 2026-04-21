const markerCatalog = {
  hemoglobin: {
    key: "hemoglobin",
    label: "Hemoglobin",
    unit: "g/dL",
    low: 12,
    high: 15.5,
    criticalLow: 8,
    insights: {
      low: "This may suggest anemia or another deficiency-related pattern and should be correlated with symptoms and iron studies.",
      normal:
        "This falls inside a common adult reference band and usually suggests adequate oxygen-carrying capacity.",
      high: "This is above a common reference range and may warrant follow-up depending on hydration, altitude, smoking, or clinical history.",
      critical:
        "This value is far below the common reference range and deserves urgent medical attention.",
    },
  },
  wbc: {
    key: "wbc",
    label: "White Blood Cell Count",
    unit: "K/uL",
    low: 4,
    high: 11,
    criticalLow: 2,
    insights: {
      low: "A low white blood cell count can be associated with viral illness, marrow suppression, or medication effects.",
      normal:
        "This sits within a common white cell reference range and may reflect a stable immune response contextually.",
      high: "An elevated white blood cell count may suggest infection, inflammation, stress response, or another reactive process.",
      critical:
        "This value is markedly low and may reflect significant immune suppression that should be reviewed urgently.",
    },
  },
  platelets: {
    key: "platelets",
    label: "Platelet Count",
    unit: "K/uL",
    low: 150,
    high: 450,
    criticalLow: 75,
    insights: {
      low: "A low platelet count may increase bleeding risk and should be interpreted with symptoms, trends, and medications.",
      normal:
        "This falls within a commonly used platelet range and may suggest adequate clotting reserve.",
      high: "An elevated platelet count can occur in inflammation, iron deficiency, or reactive states and may need trend review.",
      critical:
        "This platelet level is significantly low and deserves prompt clinical attention, especially if bleeding symptoms are present.",
    },
  },
  glucose: {
    key: "glucose",
    label: "Fasting Glucose",
    unit: "mg/dL",
    low: 70,
    high: 99,
    criticalLow: 55,
    insights: {
      low: "A low fasting glucose value may relate to prolonged fasting, medication effects, or metabolic imbalance.",
      normal:
        "This sits inside a common fasting glucose reference band and may suggest stable baseline sugar control.",
      high: "A high fasting glucose may indicate impaired glucose regulation and deserves follow-up with repeat testing or HbA1c.",
      critical:
        "This value is very low and should be reviewed urgently, especially if symptoms such as sweating or confusion are present.",
    },
  },
  cholesterol: {
    key: "cholesterol",
    label: "Total Cholesterol",
    unit: "mg/dL",
    low: 125,
    high: 200,
    criticalLow: 100,
    insights: {
      low: "A lower total cholesterol value is not always harmful, but it should be interpreted in the broader clinical context.",
      normal:
        "This total cholesterol value is within a generally accepted target range for many adults.",
      high: "An elevated total cholesterol value can increase cardiovascular risk depending on LDL, HDL, triglycerides, and overall history.",
      critical:
        "This value is unusually low and should be reviewed in context with nutrition, liver function, and overall health.",
    },
  },
};

module.exports = markerCatalog;
