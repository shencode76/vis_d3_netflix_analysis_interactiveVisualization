# Put the JavaScript code you write in this folder

The main.js file contains all the javascript codes for these two visualization: grouped bar plots and the line chart. 
The grouped bar plot groups the number of shows and number of movies by countries. 

To distinguish the two bars in each groups, the green bar refers to the number of TV shows, and the yellow bar refers to the number of movies in the local library. 

The grouped bar plot is a interactive bar plot. When you have your mouse slip over the bars, the bars would expand and trun to dark green. When you stay your mouse over a bar, the bar will become steel blue. 

The line chart is also an interactive one. When you have your mouse over the line, the red spot would tell you the release year and the number of TV shows released by this specific year. 

We recommend you separate the implementation details for individual visualizations using the [Reusable Charts](https://bost.ocks.org/mike/chart/) framework Mike Bostock advocates.
Broadly this means implementing visualizations as closures with getter-setter methods.
This can be further extended to [making updatable charts](https://www.toptal.com/d3-js/towards-reusable-d3-js-charts).