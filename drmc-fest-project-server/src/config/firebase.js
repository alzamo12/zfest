// import admin from "firebase-admin";
// import config from "./env.js";

// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert({
//             projectId: config.firebase_project_id,
//             clientEmail: config.firebase_client_email,
//             privateKey: config.firebase_private_key.replace(/\\n/g, "\n"),
//         }),
//     });
// }

// export default admin;

// import admin from "firebase-admin";
// import config from "./env.js";

// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert({
//             projectId: config.firebase_project_id,
//             clientEmail: config.firebase_client_email,
//             privateKey: config.firebase_private_key.replace(/\\n/g, "\n"),
//         }),
//     });
// }

// // console.log(admin)

// export default admin;

import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import config from "./env.js";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: config.firebase_project_id,
        clientEmail: config.firebase_client_email,
        privateKey: config.firebase_private_key.replace(/\\n/g, "\n"),
      }),
    });

const admin = {
  auth: () => getAuth(app),
};

export default admin;