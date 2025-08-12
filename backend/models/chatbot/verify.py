import google.generativeai as genai

genai.configure(api_key="AIzaSyAHGzaFXJOFWiMzzbAPQ_EEc4-b9FAULdU")
for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        print(m.name)
