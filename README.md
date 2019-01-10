# documentsearch

## Deployment Instructions

1. Set up a Firebase project (Google Cloud Platform)
2. Upgrade Firebase project to the Blaze (pay as you go) tier
3. Create a secondary site in the Firebase control panel under the _Hosting_ section. This will be for the management interface.
4. Set up a project repository
5. Copy the contents of this repository to the new repository
6. Install firebase-tools CLI with `npm i -g firebase-tools`
7. Login to Firebase CLI with `firebase login`
8. Select Firebase project or create a new one
9. In the Firebase console, click the Database section and set up a Firestore instance.
10. [Install Google Cloud CLI](https://cloud.google.com/appengine/docs/standard/nodejs/setting-up-environment)
11. [Set up your Google Cloud Project](https://cloud.google.com/appengine/docs/standard/nodejs/console/)
12. Enable the Cloud Natural Language API for the Google Cloud project
13. Install dependencies for functions, interface, parser, and management sub-projects using `yarn` or `npm install`
14. Set environment variables for functions, interface, parser, and management sub-projects as outlined below
15. Deploy the project (functions, interface, and management) with `firebase deploy`
16. Deploy the parser with `gcloud deploy`
17. After deployment, in the Google Cloud web console, upgrade each cloud function and the app engine to the appripriate tier.

## Development and production environments

Firebase requires separate projects to [host multiple environments](https://firebase.google.com/docs/projects/multiprojects) for the interface and functions.

To differentiate between the two, use the command `firebase use -P *environment*` prior to any
running `firebase deploy` as detailed above.

## Files to update prior to deployment

#### Top-level

`.firebaserc` and `firebase.json`

Change `target` field to use the name of the firebase project.

#### Interface

`.env`
Get the URL below from the Firebase functions console

```
REACT_APP_CLOUD_SEARCH_ENDPOINT=https://xxxx.cloudfunctions.net/search
```

`firebaseconfig.json`

```
{
  "apiKey": "xxx",
  "authDomain": "xxx.firebaseapp.com",
  "databaseURL": "https://xxx.firebaseio.com",
  "projectId": "xxx",
  "storageBucket": "xxx.appspot.com",
  "messagingSenderId": "xxx"
}

```

#### Functions

`.env`
FIREBASE_TOKEN is generated using `firebase login:ci` locally

```
CLOUD_SEARCH_ENDPOINT=xxxxxxxxxxxxxxx.cloudsearch.amazonaws.com

APP_ENGINE_ENDPOINT=documentsearch-b1881

AWS_ACCESS_KEY=xxxxxxxxxxxxxxx

AWS_SECRET_KEY=xxxxxxxxxxxxxxx

AWS_REGION=xxx-xxx-1

FIREBASE_TOKEN=xxx

```

#### Parser

`firebaseconfig.json`

```
{
  "apiKey": "xxx",
  "authDomain": "xxx.firebaseapp.com",
  "databaseURL": "https://xxx.firebaseio.com",
  "projectId": "xxx",
  "storageBucket": "xxx.appspot.com",
  "messagingSenderId": "xxx"
}

```

## Firestore data model

```
Authentication



Analytics



Documents(collection):

    Document : {

        id: 'string',

        parentId: 'string',

        childIds: ['string', 'string'],

        tags: ['string', string'],

        initialUploadDate: Date,

        lastModified: Date,

        fileName: 'string',

        format: 'string', // pdf, word, etc.

        url: 'string',

        thumbnailUrl: 'string',

        length: Number,

        processingStatus: 'string',

        uploadedToStorage: boolean,

        uploadedToIndex: boolean,

        deletedFromStorage: boolean,

        deletedFromIndex: boolean,

        processedByIndex: boolean,

        error: Error

    }

```

## Management Redux Model

```
filters: {

    search: 'string',

    sortFields: ['string', 'string'],

    sortBy: 'string',

    sortAscending: boolean,

}



documents: {

    id1: {

        // ...exactly as received from Firestore

    },

    id2: {

        // ...

    }

}



navigation: {

    showUpload: boolean,

    showDelete: boolean,

    showDocumentDetails: boolean,

    selectedDocument: 'string',

    directory: ['string', 'string']

}



status: {

    // ...exactly as received from Firestore

    processing: boolean,

    processingDocuments: ['string', 'string']

}

```
