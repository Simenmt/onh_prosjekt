const form = document.querySelector('form');
const prompt = document.querySelector('#prompt');
const content = document.querySelector('#content');
const questionCheck = document.querySelector("#question");
const sumCheck = document.querySelector("#summarize");

// Litt funksjonalitet for å gjøre fremvisningen av responsen mer naturlig
function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 10);
}

const handleSubmit = (e) => {
    e.preventDefault();

    content.innerHTML = "";
    const data = prompt.value;
    form.reset();

    generateSummary(data);
}

// I og med at siden ikke skal deployes eller være tilgjelig for andre legges API-nøkkelen rett inn her
const openaiApiKey = "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";
const endpoint = "https://api.openai.com/v1/engines/text-davinci-003/completions";

const generateSummary = (prompt) => {
    // Formaterer prompt i henhold til hva brukeren ønsker å få ut
    if (questionCheck.checked) {
        prompt = `Lag en flervalgsoppgave med 4 alternativer, hvor kun et alternativ er korrekt, de tre andre skal være feil.
        Oppgi også hvilket av alternativene som er korrekte. Responsen din skal være et JSON-objekt. Formater JSON-objektet
        som dette:
        {
            "question": "String",
            "options": [
                {
                    "text": "String",
                    "correct": boolean
                },
                {
                    "text": "String",
                    "correct": boolean
                },
                {
                    "text": "String",
                    "correct": boolean
                },
                {
                    "text": "String",
                    "correct": boolean
                }
            ]
        }\n\n
        Oppgaven og svarene skal komme av følgende tekst: \n\n` + prompt;
    } if (sumCheck.checked) {
        prompt = `Lag et sammendrag av følgende tekst:\n\n` + prompt;
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + openaiApiKey,
        "Accept": "application/json"
    };

    const data = {
        "prompt": prompt,
        "max_tokens": 800,
        "temperature": 0.5,
        "top_p": 1.0,
        "frequency_penalty": 0.0,
        "presence_penalty": 1,
    };

    axios.post(endpoint, data, { headers })
        .then(response => {
            const jsonResponse = response.data;
            // Respons for spørsmål som et JSON-objekt
            // JSON.parse(jsonResponse.choices[0].text);
            const parsedData = jsonResponse.choices[0].text.trim();
            typeText(content, parsedData);
        })
        .catch(error => {
            console.log(error);
        });
}

form.addEventListener('submit', handleSubmit);