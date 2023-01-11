/*
!!!!!!
!!!This is just in testing and should not be considered suitable for production
!!!!!!

Leond's Cinematic Camera Macro
V0.0.3

Currently takes a list of lists containing
  The Camera Point: A tile ID for the tile the camera will go
  The Look at Poing: A tile ID for the tile the camera will look at
  Optional: A delay amount in MS
  [["<Tile ID: Camera Point>", "<Tile ID: Look at Point", <Delay (ms)>]]
  You can enter those below:
*/
let keyframes = [  
  ["MrEJiAVMuxrBrJLI", "XJPiSrk2jBwx5CbV"],
  ["XJPiSrk2jBwx5CbV", "TSoCnrXzPfdVPUBs", 1000],
  ["VWn706yQsjyF2M9p", "TSoCnrXzPfdVPUBs"],
  ["TSoCnrXzPfdVPUBs", "sVhAasmGHpvhFpEB", 4000],
  ["MrEJiAVMuxrBrJLI", "YpHOcH76wkjUBN3E", 4000],
  ["rK73pwhYwNYBfnYY", "YnwoOP1vXSrdgWWs"]
];
/*
Todo:
[ ] Rework this to objects instead of arrays ?Maybe allow for both as the array option is easier to write out by hand.
    ```
    let keyframes = [{
      objectType: "tile",
      cameraPointID: {
        objectType: "tile",
        id: "MrEJiAVMuxrBrJLI"
      },
      lookAt: {
        objectType: "tile",
        id: "XJPiSrk2jBwx5CbV"
      },
      delay: 0
    }];
    ```
[ ] Add an "offset" for the distance to allow choosing how close you want the camera
      Should allow for better control and make it easier to work with not invisible tiles and tokens.

Notes/Plans:


Look into:
[ ] Moving more of the animation handling to the client side
    - Initial tests have shown that the camera speed is different on each machine
    - This could potentially cause issies if used in session down the line, will have to be investigated
    - Adding some sort of "syncing"/"wait for" feature may help with that


[ ] An option for callbacks to run other macros. 
    - This might be able to allow for the aformentioned "syncing"/"wait for" point 
    -- to help keep longer animations or time specific moments in sync
    -- allow visual reporting of this back to the DM somehow

Look into:
 [ ] Locking the camera during animation
     - Allowing for the option to skip




[ ] Tagger support
    - tags: Camera, Point#, Lootat, Point#
    - Logic: 
    -- Look for all Camera and Points tags, 
    -- organize by point#, 
    -- throw error if missing matched point, 
    -- throw error if 2 share both a Type and Point tag
    --- ("Sorry, we find it hard to (look|be) in 2 places at once")

*/

let i = 0;
function cinematicCamera(points, speed) {
    let currentPointIndex = 0;
    let currentPoint = points[currentPointIndex];
    let animate = function() {
      i++;
      console.log("Midpoint Check: "+i);
      // Calculate the distance between the camera and the next position
      let distance = game.Levels3DPreview.camera.position.distanceTo(currentPoint.camera);
      console.log("Distance: "+distance);
      //Calculate the time it should take to animate between the current point and the next point
      //This needs work. These values seem to be decent but the speed on the camera is weird.
      //currently intentionally checking too often to make sure it transitions smoothly
      let duration = (distance*47) / (speed);
      console.log("Duration: "+duration);
      // Animate the camera to the current point
      if(i<=1){
        game.Levels3DPreview.helpers.focusCameraToPosition(currentPoint.camera, currentPoint.look, speed, [currentPoint]);
      }
      // Set a timeout to move to check the distance after the duration
      setTimeout(function(delay= currentPoint.delay) {
        let distance = game.Levels3DPreview.camera.position.distanceTo(currentPoint.camera);
        if (currentPointIndex === points.length - 1) {
          return;
        }
        //check if the camera has reached the target and repeat the loop if not.
        if (distance >= 0.1){
          console.log("Distance2: "+ distance)
          animate();
          return;
        }
        console.log("Arrived! Distance: "+ distance)
        //update the current point
        currentPointIndex++;
        currentPoint = points[currentPointIndex];
        //Check if there is a delay at this point and wait if there is
        if(delay){
          i=0;
          console.log("Delaying: "+delay)
          setTimeout(function(){
            console.log("Delay complete")
            animate();
          },delay)
          return;
        }
        //if there isn't a delau just go to the next point
        if(!delay){
          i=0;
          animate();
        }
      }, duration);
    };
  
    // Start the animation
    animate();
  }

let frames = []
 for (let key of keyframes){ 
      frames.push({ camera: game.Levels3DPreview.tiles[key[0]].mesh.position, look: game.Levels3DPreview.tiles[key[1]].mesh.position, delay: key[2]});
}
console.log(frames);
cinematicCamera(frames, 0.003);
