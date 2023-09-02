import { auth, provider, storage } from "../firebase";
import db from "../firebase";
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "./actionType";

//This function is an action creator used to create actions that set the user in the Redux store.
export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});
//It is a Redux thunk function that returns another function (a dispatch function).
//When called, signInAPI will dispatch a sign-in action using Firebase's signInWithPopup method, which displays a pop-up window for the user to sign in.
//If the sign-in is successful, the user's data is extracted from the payload and passed to the setUser action creator, which creates an action to set the user in the Redux store.
export function signInAPI() {
  return (dispatch) => {
    auth
      .signInWithPopup(provider) // or .signInWithPopup(provider)  or signInWithRedirect(provider)
      .then((payload) => {
        // console.log(payload);
        dispatch(setUser(payload.user));
      })
      .catch((error) => alert(error.message));
  };
}

//It is also a Redux thunk function that returns another function (a dispatch function)
//When called, getUserAuth sets up an event listener (onAuthStateChanged) that listens for changes in the user's authentication state.
//If a user is authenticated (signed in), the setUser action creator is called with the authenticated user data to dispatch an action to set the user in the Redux store.
export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

//Like the previous functions, it is a Redux thunk function that returns another function (a dispatch function).
//When called, signOutAPI calls Firebase's signOut method to sign out the user.
//If sign-out is successful, the setUser action creator is called with null as the argument, which dispatches an action to set the user to null in the Redux store (indicating that there is no authenticated user).
export function signOutAPI() {
  return (dispatch) =>
    auth
      .signOut()
      .then(() => {
        // Dispatch the action to set the user to null
        dispatch(setUser(null));
      })
      .catch((error) => {
        // Handle any errors that might occur during sign-out
        console.log(error.message);
      });
}

//export function postArticleAPI(payload) { ... }: This is an action creator function that is used to post an article to the Firestore database. It takes a payload as input, which contains information about the article to be posted, such as the image, video, description, etc.

//return (dispatch) => { ... }: This is a thunk function, which is a special type of action creator that allows you to perform asynchronous operations, such as uploading an image and interacting with databases. Thunk functions return another function that receives the dispatch function as an argument. This allows us to dispatch multiple actions and handle asynchronous operations within the function.

//if (payload.image !== "") { ... }: This checks if the payload contains an image. If it does, the function proceeds with uploading the image to Firebase Storage.

//const upload = storage.ref(image/${payload.image}).put(payload.image);: This line uploads the image to Firebase Storage. It uses the storage.ref() method to create a reference to the location where the image will be stored, and then the put() method is used to upload the image data to that location.

//upload.on(...: This attaches an event listener to the upload task to track the upload progress and handle the completion of the upload.

//(snapshot) => { ... }: This is a callback function that is called whenever there is a state change in the upload task. It is used to track the progress of the upload.

//const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;: This calculates the percentage of bytes transferred to show the progress of the upload.

//console.log(Progress: ${progress}%);: This logs the progress of the upload to the console.

//if (snapshot.state === "RUNNING") { ... }: This is an additional check to ensure that the state of the upload is "RUNNING," and logs the progress again if it is.

//async () => { ... }: This is the callback function that is called when the upload is complete. It is an asynchronous function because it uses await inside.

//const downloadURL = await upload.snapshot.ref.getDownloadURL();: This line retrieves the download URL of the uploaded image using the getDownloadURL() method on the upload.snapshot.ref.

//db.collection("articles").add({ ... }): This adds a new document to the "articles" collection in Firestore. The document contains information about the article, such as the actor (user), video, sharedImg (download URL of the uploaded image), comments count, and description.

//In summary, this code handles the process of uploading an image to Firebase Storage and then adding an article to the Firestore database with the relevant information, including the download URL of the uploaded image.
export function postArticleAPI(payload) {
  return (dispatch) => {
    // Function that returns another function (thunk)
    dispatch(setLoading(true));
    if (payload.image !== "") {
      // Check if the payload contains an image
      const upload = storage
        .ref(`image/${payload.image.name}`)
        .put(payload.image);
      // Upload the image to Firebase Storage

      upload.on(
        "state_changed",
        (snapshot) => {
          // Event listener for tracking the upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progress: ${progress}%`);
          if (snapshot.state === "RUNNING") {
            console.log(`Progress: ${progress}%`);
          }
        },
        (error) => console.log(error.code),
        async () => {
          // Callback function once the upload is complete
          const downloadURL = await upload.snapshot.ref.getDownloadURL();
          // Get the download URL of the uploaded image
          db.collection("articles").add({
            // Add an article to the Firestore collection "articles"
            actor: {
              description: payload.user.email,
              title: payload.user.displayName,
              date: payload.timestamp,
              image: payload.user.photoURL,
            },
            video: payload.video,
            sharedImg: downloadURL,
            comments: 0,
            description: payload.description,
          });
          dispatch(setLoading(false));
        }
      );
    } else if (payload.video) {
      db.collection("articles").add({
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImg: "",
        comments: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    }
  };
}

export function getArticlesAPI() {
  return (dispatch) => {
    let payload;

    db.collection("articles")
      .orderBy("actor.date", "desc")
      .onSnapshot((snapshot) => {
        payload = snapshot.docs.map((doc) => doc.data());
        console.log(payload);
        dispatch(getArticles(payload));
      });
  };
}
