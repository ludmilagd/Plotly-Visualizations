

// Function to get data to create plots  
function getplot(id) {
    
  // get the data from the json file
  d3.json("samples.json").then((data)=> {
      console.log(data)

      var freq = data.metadata.map(md => md.wfreq)
      console.log(`Frequency: ${freq}`)   

      var frequencia = data.metadata.filter(f => f.id.toString() === id)[0];
      console.log("%j", frequencia);
      
      var jsonF = JSON.parse(JSON.stringify(frequencia));
      var Fwash = jsonF.wfreq;
      console.log(Fwash);
      console.log(jsonF.age);
      
      // filter sample values by id 
      var otu_samples = data.samples.filter(s => s.id.toString() === id)[0];

      console.log(otu_samples);

      // get top 10 sample values to plot
      var sampleValues = otu_samples.sample_values.slice(0, 10).reverse();

      // get top 10 otu ids for the plot
      var idValues = (otu_samples.otu_ids.slice(0, 10)).reverse();
      
      // get the otu id's 
      var idOtu = idValues.map(d => "Otu " + d)

      console.log(`OTU IDS: ${idOtu}`)

      // get the top 10 labels for the plot
      var labels = otu_samples.otu_labels.slice(0, 10);

      console.log(`Sample Values: ${sampleValues}`)
      console.log(`Id Values: ${idValues}`)

      
      // create trace variable for the plot
      var trace = {
          x: sampleValues,
          y: idOtu,
          text: labels,
          type:"bar",
          orientation: "h",
      };

      // create data variable
      var data = [trace];

      // create layout variable to set plots layout
      var layout = {
          title: "Top 10 OTU",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 150,
              r: 150,
              t: 50,
              b: 20
          }
      };

      // create the bar plot
      Plotly.newPlot("bar", data, layout);

     
      
      // create the trace for the bubble chart
      var trace1 = {
          x: otu_samples.otu_ids,
          y: otu_samples.sample_values,
          mode: "markers",
          marker: {
              size: otu_samples.sample_values,
              color: otu_samples.otu_ids
          },
          text: otu_samples.otu_labels

      };

      // set the layout for the bubble plot
      var layout = {
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1300
      };

      // create the data variable 
      var data1 = [trace1];

      // create the bubble plot
      Plotly.newPlot("bubble", data1, layout); 

      
      // create gauge chart
      var data = [
        {
          domain: { x: [0, 9], y: [0, 9] },
          value: Fwash,
          title: { text: "Belly Button Washing Frequency" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "F6FBE8" },
              { range: [1, 2], color: "F2F9DD" },
              { range: [2, 3], color: "EEF6D1" },
              { range: [3, 4], color: "EAF4C6" },
              { range: [4, 5], color: "E1F0AF" },
              { range: [5, 6], color: "E9F4C5" },
              { range: [6, 7], color: "D3E98B" },
              { range: [7, 8], color: "BEDE51" },
              { range: [8, 9], color: "A8D317" }
            ]}
        }
      ];
      
      var layout = { "titlefont": {
        "size": 100
      }, width: 600, height: 500, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data, layout);
      
  });    
}
  
// create the function to get demographics
function getInfo(id) {
  // read the json file to get demographics
  d3.json("samples.json").then((data)=> {
      
      // get the metadata info for the demographic panel
      var metadata = data.metadata;

      console.log(metadata)

      // filter meta data info by id
      var result = metadata.filter(meta => meta.id.toString() === id)[0];

      // select demographic panel to put data
      var demographicInfo = d3.select("#sample-metadata");
      
      // empty the demographic info panel each time before getting new id info
      demographicInfo.html("");

      // grab the necessary demographic data data for the id and append the info to the panel
      Object.entries(result).forEach((key) => {   
              demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}

// create the function for the change event


function optionChanged (id) {
  getplot(id);
  getInfo(id);
}

// create the function for the initial data rendering
function init() {
  // select dropdown menu 
  var dropdown = d3.select("#selDataset");

  // read the data 
  d3.json("samples.json").then((data)=> {
      console.log(data)

      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // call the functions to display the data and the plots to the page
      getplot(data.names[0]);
      getInfo(data.names[0]);
  });
}

init();