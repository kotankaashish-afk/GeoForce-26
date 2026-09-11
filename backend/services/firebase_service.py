import os

import firebase_admin
from firebase_admin import credentials, firestore


RENDER_CREDENTIAL_PATH = "/etc/secrets/firebase-service-account.json"

LOCAL_CREDENTIAL_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "firebase-service-account.json"
    )
)

if os.path.exists(RENDER_CREDENTIAL_PATH):
    credential_path = RENDER_CREDENTIAL_PATH
else:
    credential_path = LOCAL_CREDENTIAL_PATH

cred = credentials.Certificate(credential_path)

firebase_admin.initialize_app(cred)

db = firestore.client()