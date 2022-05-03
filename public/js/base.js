// contains some base functions for performing
// data manipulation

function secondSmallest(arr) {
    let min = Infinity, result = -Infinity;
  
    for (const value of arr) {
      const nr = Number(value);
  
      if (nr < min) {
        [result, min] = [min, nr]; 
      } else if (nr > min && nr < result) {
        result = nr;
      }
    }
  
    return result;
  }

/*
    MASS: Modern Applied Statistics with S
    Based on the MASS (“Modern Applied Statistics With S”) package for R.
    Contains functions for managing and computing dataframes for descriptive statistics.
*/


// --- the following are general purpose functions for validation and checking

function checkColumnsInDF(cols, dat){
    for(let j = 0; j < cols.length; j ++){
        let in_df = Object.keys(dat[0]).includes(cols[j]);
        if(!in_df){
            return(false);
            break;
        }
    }

    return(true);
}

function toNumber(arr){
    let num_arr = [];
    for(let i = 0; i < arr.length; i++){
        if(typeof arr[i] === 'number'){
            num_arr.push(arr[i]);
        }else{
            num_arr.push(null);
        }
    }

    return(num_arr);
}

function na_rm(dat){
    let n_col = ncol(dat);
    let n_row = nrow(dat);
    let colnames = Object.keys(dat[0]);

    let dat_complete = [];

    for(let i = 0; i < n_row; i++){
        current_row = dat[i];
        let this_row_valid = true;

        for(let j = 0; j < n_col; j++){
            if(current_row[colnames[j]] === null){
                this_row_valid = false;
                break;
            }
        }

        if(this_row_valid){
            dat_complete.push(current_row);
        }
    }

    return dat_complete;
}

// --- the following are general purpose functions for transforming between JSON and array formats

function nrow(dat){
    return dat.length;
}

function ncol(dat){
    if(nrow(dat) > 0){
        column_names = Object.keys(dat[0]);
        return column_names.length;
    }else{
        return 0;
    }
}

function dfColToArray(dat, col = NULL){
    let newArray = [];
    let column_names = Object.keys(dat[0]);

    if(typeof col === 'number'){
        let k = column_names[col];
        for(let j = 0; j < dat.length; j++){
            newArray.push(dat[j][k]);
        }

    }else{
        for(let j = 0; j < dat.length; j++){
            newArray.push(dat[j][col]);
        }

    }

    return newArray;
}

function dfRowToArray(dat, row = 0){
    let newArray = [];
    let current_row = dat[row];
    let column_names = Object.keys(current_row);

    for(let j = 0; j < column_names.length; j++){
        let this_column = column_names[j];
        newArray.push(current_row[this_column]);
    }

    return newArray;
}

function dfPos(dat, pos){
    if(pos.length != 2){
        return null;    
    }

    let x = pos[0];
    let y = pos[1];

    if(typeof y === "number"){
        let column_name = Object.keys(dat[x])[y];
        return dat[x][column_name];
    }else{
        return dat[x][y];
    }
}

function unique(x){
    let unique_x = [];
    
    for(let j = 0; j < x.length; j++){
        if(! unique_x.includes(x[j])){
            unique_x.push(x[j]);
        }
    }

    return unique_x;
}

// --- general purpose functions useful for matrix and vector algebra

function rep(x, times = 1){
    let newArray = [];
    
    for(let j = 0; j < times; j++){
        newArray.push(x);
    }

    return newArray;
}

function arrSum(x){
    let sum = x.reduce(function(a, b){
        return a + b;
    }, 0);

    return sum;
}

function arrMax(x){
    let max = x.reduce(function(a, b) {
        return Math.max(a, b);
    });

    return max;
}

function arrMin(x){
    let min = x.reduce(function(a, b) {
        return Math.min(a, b);
    });

    return min;
}

function seq(from, to, by = null){
    if(by != null){
        
        let last_val = from;
        let seq_array = [];

        while(last_val < to){
            seq_array.push(last_val);
            last_val += by;
        }

        if(seq_array[seq_array.length - 1] != to) seq_array.push(to);

        return seq_array;

    }else{
        throw 'Error: you must specify a by';
    }

}

function seq_along(arr){
    if(arr.length > 0){
        seq_array = [];
        for(let i = 0; i < arr.length; i++){
            seq_array.push(i);
        }

        return seq_array;

    }else{
        throw 'Error: arr must be a proper array with length at least 1';
    }

}

function innerProduct(x,y){
    if(x.length != y.length){
        throw 'Error: x and y not of the same length';
    }

    let xy = [];
    for(i = 0; i < x.length; i++){
        xy.push(x[i] * y[i]);
    }

    return(arrSum(xy));
}

// --- general purpose statistical functions

function mean(x){
    let sum = arrSum(x);
    let count = x.length;

    return sum/Math.max(count,1);
}

function variance(x){
    let mean_x = mean(x);

    let sqdevs = [];
    for(let j = 0; j < x.length; j++){
        sqdevs.push((x[j] - mean_x)**2);
    }

    return arrSum(sqdevs)/Math.max(x.length-1,1);
}

function stdev(x){
    return Math.sqrt(variance(x));
}

// --- functions for creating, subsetting, and merging dataframes
function arrayToDF (x, colnames, byrow = true){
    
    // length of array x should be multiple of number of columns
    if(x.length % colnames.length > 0){
        throw 'Error: length of x must be a multiple of column number';
    }

    let n_row = x.length / colnames.length;

    let df_form = [];

    if(byrow){

        let elem_num = 0;
        for(let i = 0; i < n_row; i++){
            let current_row = {};
            for(let j = 0; j < colnames.length; j++){
                current_row[colnames[j]] = x[elem_num];
                elem_num += 1;
            }
            df_form.push(current_row);
        }

    }else{

        // rearrange into columns
        to_df = {};
        let start = 0;
        let end = n_row - 1;

        for(let i = 0; i < colnames.length; i++){
            let current_col = [];
            start = start + i*n_row;
            end = end + i*n_row;

            for(let j = start; j <= end; j++){
                current_col.push(x[j])
            }

            to_df[colnames[i]] = current_col
        }

        df_form = dataframe(to_df);

    }

    return df_form;
}

function dataframe(obj){
    let col_names = Object.keys(obj);
    let n_columns = col_names.length;

    col_lengths = [];
    for(let i = 0; i < n_columns; i++){
        col_lengths.push(obj[col_names[i]].length);
    }

    n_rows = arrMin(col_lengths);
    let df_form = [];

    for(j = 0; j < n_rows; j++){
        let current_row = {};
        for(k = 0; k < n_columns; k++){
            current_col = obj[col_names[k]];
            current_row[col_names[k]] = current_col[j];
        }
        df_form.push(current_row);
    }

    return df_form;
}

function dfToObject(dat){ // reverse of dataframe
    let colnames = Object.keys(dat[0]);
    let n_col = colnames.length;
    let obj_form = {};

    for(let i = 0; i < n_col; i++){
        obj_form[colnames[i]] = dfColToArray(dat = dat, col = colnames[i]);
    }

    return obj_form;
}

// -- functions for merging dataframes
function searchDF(dat, val, col){
    let returned_rows = [];
    for(let i = 0; i < dat.length; i++){
        let current_row = dat[i];
        if(current_row[col] == val) returned_rows.push(current_row);
    }

    return(returned_rows);
}

function innerjoin(x,y,by=[]){
    // get list of columns to extract
    let mergecol_name = by[0];
    let mergecol_x = dfColToArray(x, mergecol_name);
    let mergecol_y = dfColToArray(y, mergecol_name);
    let mergecol_content = [];
    let merged_df = [];

    // get elements in both x and y
    for(let i = 0; i < mergecol_y.length; i++){
        if(mergecol_x.includes(mergecol_y[i])){
            mergecol_content.push(mergecol_y[i]);
        }
    }

    // now create a new dataframe
    for(let i = 0; i < mergecol_content.length; i++){
        let found_x = searchDF(x,mergecol_content[i],mergecol_name);
        let found_y = searchDF(y,mergecol_content[i],mergecol_name);

        for(let j = 0; j < found_x.length; j++){
            for(let k = 0; k < found_y.length; k++){
                let curr_found_x = JSON.parse(JSON.stringify(found_x[j]));
                let curr_found_y = JSON.parse(JSON.stringify(found_y[k]));
                delete curr_found_y[mergecol_name];
                let merged = {...curr_found_x, ...curr_found_y};
                merged_df.push(merged);
            }
        }
    }

    return(merged_df);
}

function leftdiff(x,y,by=[]){
    // get list of columns to extract
    let mergecol_name = by[0];
    let mergecol_x = dfColToArray(x, mergecol_name);
    let mergecol_y = dfColToArray(y, mergecol_name);
    let mergecol_content = [];
    let merged_df = [];

    // get elements in x not in y
    for(let i = 0; i < mergecol_x.length; i++){
        if(! mergecol_y.includes(mergecol_x[i])){
            mergecol_content.push(mergecol_x[i]);
        }
    }

    // create an object containing nulls from the key-values in y
    let sample_y = JSON.parse(JSON.stringify(y[0]));
    delete sample_y[mergecol_name];
    let cols_y = Object.keys(sample_y);
    na_y = arrayToDF(rep(null, times = cols_y.length), cols_y)[0];

    // now create a new dataframe
    for(let i = 0; i < mergecol_content.length; i++){
        let found_x = searchDF(x,mergecol_content[i],mergecol_name);

        for(let j = 0; j < found_x.length; j++){
            let curr_found_x = found_x[j];
            let merged = {...curr_found_x, ...na_y};
            merged_df.push(merged);
        }
    }

    return(merged_df);
}

function rightdiff(x,y,by=[]){
    // get list of columns to extract
    let mergecol_name = by[0];
    let mergecol_x = dfColToArray(x, mergecol_name);
    let mergecol_y = dfColToArray(y, mergecol_name);
    let mergecol_content = [];
    let merged_df = [];

    // get elements in y not in x
    for(let i = 0; i < mergecol_y.length; i++){
        if(! mergecol_x.includes(mergecol_y[i])){
            mergecol_content.push(mergecol_y[i]);
        }
    }

    // create an object containing nulls from the key-values in x
    let sample_x = JSON.parse(JSON.stringify(x[0]));
    delete sample_x[mergecol_name];
    let cols_x = Object.keys(sample_x);
    na_x = arrayToDF(rep(null, times = cols_x.length), cols_x)[0];

    // now create a new dataframe
    for(let i = 0; i < mergecol_content.length; i++){
        let found_y = searchDF(y,mergecol_content[i],mergecol_name);

        for(let j = 0; j < found_y.length; j++){
            let curr_found_y = found_y[j];
            let merged = {...curr_found_y, ...na_x};
            merged_df.push(merged);
        }
    }

    return(merged_df);
}

function merge(x = null, y = null, by = [], type="inner"){

    // data validation
    if(! checkColumnsInDF(by, x)){
        throw 'Error: One or more columns specified not in x.dataframe';
    }

    if(! checkColumnsInDF(by, y)){
        throw 'Error: One or more columns specified not in y.dataframe';
    }

    let inner = innerjoin(x,y,by);
    let right = rightdiff(x,y,by);
    let left = leftdiff(x,y,by);

    if(type == "inner"){
        return inner;
    }else if(type == "left"){
        return inner.concat(left);
    }else if(type == "right"){
        return inner.concat(right);
    }else if(type == "full"){
        return inner.concat(left.concat(right));
    }else{
        // other options
        // - leftanti, rightanti
        throw 'Error: unimplemented operation';
    }
}

function select(which, dat){
    if(! checkColumnsInDF(which, dat)){
        throw 'Error: One or more columns specified not in dataframe';
    }

    let newArray = [];
    for(let j = 0; j < dat.length; j++){
        let newRow = {};

        for(let k = 0; k < which.length; k++){
            let key_name = which[k];
            newRow[key_name] = dat[j][key_name];
        }

        newArray.push(newRow);
    }

    return newArray;
}

// --- functions useful for obtaining summary statistics from dataframes
function subset(data, on = "", val){
    if(! checkColumnsInDF([on], data)){
        throw 'Error: One or more columns specified in by not in dataframe';
    }

    let subset_df = [];

    for(let i = 0; i < nrow(data); i++){
        if(data[i][on] == val){
            subset_df.push(data[i]);
        }
    }

    return(subset_df);
}


function aggregate(cols = [], by = [], data, FUN){
    if(! checkColumnsInDF(by, data)){
        throw 'Error: One or more columns specified in by not in dataframe';
    }

    if(! checkColumnsInDF(cols, data)){
        throw 'Error: One or more columns specified to compute not in dataframe';
    }

    if(by.length > 1){
        throw 'aggregating on multiple columns not yet implemented';
    }

    // for each column, compute on by.
    let groupCol = dfColToArray(data, by[0]);
    let uniqueGroupCol = unique(groupCol);

    let result = {};
    result[by[0]] = uniqueGroupCol;

    for(let i = 0; i < cols.length; i++){
        let current_column = dfColToArray(data, cols[i]);
        let this_column = [];

        for(let j = 0; j < uniqueGroupCol.length; j++){
            let current_group = uniqueGroupCol[j];
            let this_group = [];

            for(let k = 0; k < nrow(data); k++){
                if(groupCol[k] == current_group){
                    this_group.push(Number(current_column[k]));
                }
            }

            this_column.push(FUN(this_group));
        }

        result[cols[i]] = this_column;
    }
    
    return dataframe(result);
}

function apply(dat, margin = 1, FUN){

    if(ncol(dat) == 0 || nrow(dat) == 0){
        throw 'Error: incorrect number of dimensions on dat';
    }

    // compute per row
    if(margin == 1){

        let newData = [];
        for(let j = 0; j < nrow(dat); j++){
            let insert_val = FUN(dfRowToArray(dat, row = j));
            newData.push(insert_val);
        }

        return newData;

    // compute per column
    }else if(margin == 2){
        
        let newData = {};
        for(let j = 0; j < ncol(dat); j++){
            let colname = Object.keys(dat[0])[j];
            newData[colname] = FUN(dfColToArray(dat,col = j));
        }

        return [newData];

    }else{
        throw 'Error: unknown margin specified';
    }

}

function descriptives(dat){
    if(ncol(dat) == 0 || nrow(dat) == 0){
        throw 'Error: incorrect number of dimensions on dat';
    }

    let descs = [];
    for(let j = 0; j < ncol(dat); j++){
        let this_col_stats = {};
        let colname = Object.keys(dat[0])[j];
        let this_col = dfColToArray(dat, col=j);

        this_col_stats['x'] = colname;
        this_col_stats['Count'] = Number(this_col.length);
        this_col_stats['Sum'] = Number(arrSum(this_col));
        this_col_stats['Mean'] = Number(mean(this_col));
        this_col_stats['sd'] = Number(stdev(this_col));
        this_col_stats['Min'] = Number(arrMin(this_col));
        this_col_stats['Max'] = Number(arrMax(this_col));
        descs.push(this_col_stats);
    }

    return descs;
}

// --- cross-tabulation

// --- correlation coefficients
function pearson(x,y){
    if(x.length != y.length){
        throw 'Error: x and y not of the same length';
    }

    let xy_dev = [];
    let x_devsq = [];
    let y_devsq = [];
    let x_mean = mean(x);
    let y_mean = mean(y);

    for(let i = 0; i < x.length; i++){
        xy_dev.push((x[i] - x_mean)*(y[i] - y_mean));
        x_devsq.push((x[i] - x_mean)*(x[i] - x_mean));
        y_devsq.push((y[i] - y_mean)*(y[i] - y_mean));
    }

    let rxy = arrSum(xy_dev) / (Math.sqrt(arrSum(x_devsq)) * Math.sqrt(arrSum(y_devsq)));

    // t-test 
    let txy = rxy * Math.sqrt((x.length - 2) / (1 - (rxy * rxy)));
    let pxy = tprob(x.length - 2,Math.abs(txy));

    return({
        coefficient: Number(rxy),
        tValue: Number(txy),
        df: Number(x.length-2),
        pValue: Number(pxy)
    });
}

function spearman(x,y){
    if(x.length != y.length){
        throw 'Error: x and y not of the same length';
    }

    let x_sorted = x.slice().sort(function(a,b){return b-a});
    let y_sorted = y.slice().sort(function(a,b){return b-a});
    let x_ranks = x.map(function(v){ return x_sorted.indexOf(v)+1 });
    let y_ranks = y.map(function(v){ return y_sorted.indexOf(v)+1 });
    let dsq = [];

    for(let i = 0; i < x.length; i++){
        dsq.push((x_ranks[i] - y_ranks[i])*(x_ranks[i] - y_ranks[i]));
    }

    let rxy_inv = 6 * arrSum(dsq) / (x.length * ((x.length*x.length) - 1));
    let rxy = 1 - rxy_inv;

    // t-test 
    let txy = rxy * Math.sqrt((x.length - 2) / (1 - (rxy * rxy)));
    let pxy = tprob(x.length - 2,Math.abs(txy));

    return({
        coefficient: Number(rxy),
        tValue: Number(txy),
        df: Number(x.length-2),
        pValue: Number(pxy)
    });
}

// --- statistical tests
function tTest(x, y = 0){
    let type = 0;
    let test_result = {};

    // catch if two samples or one sample
    if(y.length == 1){
        type = 1; // for one-sample test, just do y = [alternative hypothesis]

    }else{
        type = 2;

    }

    // now perform test
    if(type == 1){
        let t = 0;
        let mean_diff = 0;
        let std_err = 0;
        let df = 0;
        let pValue = 0.00;

        mean_diff = mean(x) - y;
        std_err = stdev(x)/Math.sqrt(x.length);
        t = mean_diff / std_err;
        df = x.length;
        
        if(t > 0){
            pValue = tprob(df,t);
        }else{
            pValue = 1 - tprob(df,t);
        }
        

        // print result
        test_result["tValue"] = Number(t);
        test_result["mean_diff"] = Number(mean_diff);
        test_result["std_err"] = Number(std_err);
        test_result["df"] = Number(df);
        test_result["pValue"] = Number(pValue);

    }else{
        let t = 0;
        let mean_diff = 0;
        let std_err = 0;
        let pValue = 0.00;

        mean_diff = mean(x) - mean(y);
        std_err = Math.sqrt(variance(x)/x.length + variance(y)/y.length);
        t = mean_diff / std_err;
        df = x.length + y.length - 2;
        
        if(t > 0){
            pValue = tprob(df,t);
        }else{
            pValue = 1 - tprob(df,t);
        }

        // print result
        test_result["tValue"] = Number(t);
        test_result["mean_diff"] = Number(mean_diff);
        test_result["pooled_se"] = Number(std_err);
        test_result["df"] = Number(df);
        test_result["pValue"] = Number(pValue);

    }

    return test_result;
}

function zTest(x, y = 0){
    let type = 0;
    let test_result = {};

    // catch if two samples or one sample
    if(y.length == 1){
        type = 1; // for one-sample test, just do y = [alternative hypothesis]

    }else{
        type = 2;

    }

    // now perform test
    if(type == 1){
        let z = 0;
        let mean_diff = 0;
        let std_dev = 0;
        let pValue = 0.00;

        mean_diff = mean(x) - y;
        std_dev = stdev(x);
        z = mean_diff / std_dev;
        
        if(z > 0){
            pValue = tprob(999,z);
        }else{
            pValue = 1 - tprob(999,z);
        }
        

        // print result
        test_result["zValue"] = Number(z);
        test_result["mean_diff"] = Number(mean_diff);
        test_result["std_dev"] = Number(std_dev);
        test_result["pValue"] = Number(pValue);

    }else{
        let z = 0;
        let mean_diff = 0;
        let std_dev = 0;
        let pValue = 0.00;

        mean_diff = mean(x) - mean(y);

        Sp2_num = ((x.length - 1) * variance(x)) + ((y.length - 1) * variance(y))
        Sp2_den = x.length + y.length - 2
        Sp = Math.sqrt(Sp2_num / Sp2_den);

        std_dev = Sp * Math.sqrt(1/x.length + 1/y.length);

        z = mean_diff / std_dev;
        
        if(z > 0){
            pValue = tprob(999,z);
        }else{
            pValue = 1 - tprob(999,z);
        }

        // print result
        test_result["zValue"] = Number(z);
        test_result["mean_diff"] = Number(mean_diff);
        test_result["pooled_sd"] = Number(std_dev);
        test_result["pValue"] = Number(pValue);

    }

    return test_result;
}