# d3plotting

# Description
Produce a scatterplot of state data using D3.  

# Methods
1.  Allow for the variables on the axes to change.
2.  Label the points with the state abbreviation.
3.  Use a tooltip to display data values over the plotted point.
4.  In our scatterplot, we compute Spearman's rank correlation coefficient 
for each of the pairs of variables once at the beginning of the script and 
save the results in a `Map` object.  This speeds up the rendering, since each
time we switch a variable on an axis, we are only performing a table look-up and 
not recomputing a rank correlation (which involves two sorts and then a correlation computation).

# Results
[The plot](https://douglasdrake.github.io/d3plotting/).

# Citation
The code for computing the correlations
is from the [JavaScript Statistical Library](https://github.com/jstat/jstat).

