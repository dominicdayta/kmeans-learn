# kmeans-learn

Porting my original kmeans applet into a pedagogical tool.

## Introduction

Earlier this year, I created a [Javascript applet](https://github.com/dominicdayta/kmeans) giving users a step-by-step view into how Lloyd's Algorithm is used in cluster analysis. Here is the same applet built on top of a simple Express / Node JS web application as a pedagogical tool for teaching students how the algorithm works.

## For Developers

Initilize the server using nodemon:

```javascript
npm run devStart
```

Make sure to run mongodb (I'm assuming the system is Mac OS, Catalina onwards).

```bash
brew services run mongodb-community
```

The server is set to listen to port 4000.

## Preview

The application is now live at https://kmeanslearn.herokuapp.com/ but is currently in members-only mode.
