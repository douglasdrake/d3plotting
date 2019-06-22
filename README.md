# d3plotting

In our scatterplot, we compute Spearman's rank correlation coefficient 
for each of the pairs of variables once at the beginning of the script and 
save the results in a `Map` object.  This speeds up the rendering, since each
time we switch a variable on an axis, we are only performing a table look-up and 
not recomputing a rank correlation (which involves two sorts and then a correlation computation).

The code for computing the correlations
is from the [JavaScript Statistical Library](https://github.com/jstat/jstat).

