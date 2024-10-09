// Cada feature de geojsonData es un punto o polígono que se muestra en el mapa
// El primer feature es un polígono que representa el terreno
// Los otros features son los puntos que se muestran en el mapa
// Cada punto tiene un videoID que se usa para mostrar el video en el reproductor de video
// El videoID es el ID de un video de YouTube

export const geojsonData : GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { Name: "Terreno" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-61.994381704143002, -24.237148853049298],
            [-61.989879142699998, -24.2436434200803],
            [-61.985157039787097, -24.2423195719856],
            [-61.992025412233602, -24.2276064644538],
            [-61.988868804045701, -24.221261311369101],
            [-61.978612417830597, -24.223408114888301],
            [-61.964544144315198, -24.2310509657935],
            [-61.945166874174198, -24.2341870186496],
            [-61.941762972068702, -24.244902367825802],
            [-61.952146077221997, -24.258071015578501],
            [-61.942571358064498, -24.2601024412333],
            [-61.9309496622014, -24.257733445086298],
            [-61.9142721066086, -24.254234555470799],
            [-61.898009089561, -24.261849501549001],
            [-61.9031013729942, -24.2843705257458],
            [-61.9138405257278, -24.287568840175901],
            [-61.910025004565597, -24.298131064866698],
            [-61.886847749140998, -24.263322039001501],
            [-61.886241689671998, -24.262547985874999],
            [-61.885627819369901, -24.261371471674899],
            [-61.879419921445297, -24.262324297450601],
            [-61.876188442380702, -24.269097900388299],
            [-61.875368565839203, -24.270654505459898],
            [-61.877534006935697, -24.301601207369199],
            [-61.863481887952403, -24.307048496479801],
            [-61.844585871722302, -24.2956523282052],
            [-61.8312981390537, -24.300696110887699],
            [-61.830999714719198, -24.316203934275102],
            [-61.820193233307897, -24.3131688637602],
            [-61.806024568459897, -24.3153273169873],
            [-61.805803229324297, -24.290020809336699],
            [-61.805628098980598, -24.276446268875901],
            [-61.804496758209297, -24.178927304839],
            [-61.993641206778797, -24.102823601995102],
            [-61.994381704143002, -24.237148853049298],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        Name: "La Picada a Ojo negro",
        videoID: "7AkbUfZjS5k", // TODO Cambiar este ID por el correspondiente
      },
      geometry: {
        type: "Point",
        coordinates: [-61.935544316392402, -24.134105701920699],
      },
    },
    {
      type: "Feature",
      properties: {
        Name: "La Comunidad Wichi el Mistolar del Cruce",
        videoID: "7AkbUfZjS5k", // TODO Cambiar este ID por el correspondiente
      },
      geometry: { type: "Point", coordinates: [-61.9383, -24.2242] },
    },
    {
      type: "Feature",
      properties: {
        Name: "La Antigua Pista de Aterrizaje",
        videoID: "7AkbUfZjS5k", // TODO Cambiar este ID por el correspondiente
      },
      geometry: { type: "Point", coordinates: [-61.9353, -24.1781] },
    },
  ],
};
