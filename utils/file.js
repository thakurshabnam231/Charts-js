const  jsonData = {
    "client-id": "<Client Id>",
    "template-id": "<template-uuid>",
    "language-code" : "en",
    "tts-voice" : "john",
    "chart-metadata" : {
        "color-palette" :[ "#F44336", "#448AFF", "#7B1FA2"],
        "background-color" : "#FFFFFF",
        "charts" : [
            {
                "chart-id" : "3a7f4244-aa1e-435b-b551-38c3cdf3054f",
                "type" : "doughnut",
                "label" : "HDL",
                "value-label" : ["low", "medium", "high"],
                "value-ranges" : [0, 30, 70, 100,150]
            },
            {
                "chart-id" : "47a535fe-0230-45b9-b25c-95540122952d",
                "type" : "pie",
                "label" : "Population Demography",
                "value-label" : ["red", "green", "blue"]
            },
            {
                "chart-id" : "0a6eff19-6483-438b-9fe5-8a83b22d2cfd",
                "type" : "bar",
                "label" : "Metro Population (in Million)",
                "value-label" : ["Delhi", "Mumbai", "Chennai", "Kolkata"],
                "x-label" : "Cities",
                "y-label" : "Population"
            },
            {
                "chart-id" : "859aaa89-8b91-44cc-9d6e-b1304abfea6b",
                "type" : "line",
                "label" : "Delhi Population (in Million)",
                "value-label" : "1981-2021",
                "x-label" : "Year",
                "y-label" : "Population"
            }
        ]
    },
    "qr-code-dimension" : [100, 100],
    "video-text-max-length" : [12],
    "phrase-templates" : [
        "Hello ${request.phrase-text[0]}, ${request.phrase-text[1]} how are you?",
        "You have ${request.phrase-text[3]} percent discount"
    ],
    "image-tags" : ["person", "bike", "smiling"],
    "video-tags" : ["person", "bike", "smiling"],
    "destination": [
        { 
            "type" : "email",
            "email-template" : "path to html"
        },
        { 
            "type" : "whatsapp",
            "template-id" : "text template - TBD"
        },
        { 
            "type" : "sms",
            "template-id" : "text template - TBD"
        }
    ]
};

module.exports = jsonData;

