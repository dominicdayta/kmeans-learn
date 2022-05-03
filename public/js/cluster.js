// contains algorithm code for performing K Means clustering using
// Loyd (1982): "Least Squares Quantization in PCM"
// https://cs.nyu.edu/~roweis/csc2515-2006/readings/lloyd57.pdf

init_clusters = function(k = 2, data){
    let cluster_locations = [];
    let cluster_indices = [];
    for(let i = 0; i < k; i++){
        let index = Math.floor((Math.random() * 10) + 1);
        while(cluster_indices.includes(index)){
            index = Math.floor((Math.random() * 10) + 1);
        }
        
        selected_cluster = data[index];
        cluster_locations.push(selected_cluster);
        cluster_indices.push(index);
    }

    return cluster_locations;
}

dist_euclid = function(pt1, pt2, cols){
    let k = cols.length;
    let dist_sq = 0;
    for(let i = 0; i < k; i ++ ){
        dist_sq += (pt1[cols[i]] - pt2[cols[i]])**2;
    }

    return(Math.sqrt(dist_sq));
}

find_closest = function(data, clusters = [], cols = []){

    for(let i = 0; i < data.length; i ++){
        let current_pt = data[i];
        let min_dist = Infinity;
        let min_ind = Math.floor((Math.random() * clusters.length) + 1);

        for(let k = 0; k < clusters.length; k ++){
            let k_dist = dist_euclid(current_pt, clusters[k], cols);
            if(k_dist < min_dist){
                min_dist = k_dist;
                min_ind = k;
            }
        }

        data[i]._assigned = min_ind;
    }

    return(data);
}

update_clusters = function(data, old_clusters, cols = []){
    
    let new_clusters = [];

    for(let k = 0; k < old_clusters.length; k ++){
        let this_members = subset(data, on = "_assigned", k);
        let this_cluster_new = {};

        if(nrow(this_members)>0){
            let means = apply(this_members,2,mean)[0];
            for(let j = 0; j < cols.length; j ++){
                this_cluster_new[cols[j]] = means[cols[j]];
            }

        }else{
            for(let j = 0; j < cols.length; j ++){
                this_cluster_new[cols[j]] = this_cluster_old[cols[j]];
            }
        }

        new_clusters.push(this_cluster_new);
    }

    return(new_clusters);
}


cluster_Rsq = function(data, clusters, cols){
    let Rsq = [];
    for(let k = 0; k < clusters.length; k ++){
        let members = subset(data, "_assigned", k);
        let rsq = 0;
        for(let i = 0; i < members.length; i++){
            rsq += dist_euclid(members[i], clusters[k], cols);
        }

        Rsq.push({members: members.length, rsq: rsq});
    }

    return(Rsq);
}

iterate = function(data, clusters, cols = []){

    let iter_rsq = {};

    // update clusters
    find_closest(data, clusters, cols);
    let new_clusters = update_clusters(data, clusters, cols);
        
    // compute for changes in clusters
    let rsquares = cluster_Rsq(data, new_clusters, cols);
    for(let i = 0; i < new_clusters.length; i++){
        iter_rsq["cluster"+i] = rsquares[i].rsq;
    }

    // maximum within-group r square
    let logmax = arrMax(dfColToArray(rsquares, "rsq"));
    rsq_mean = Math.log(logmax);

    return(
        {
            status: "successful",
            fits: {
                ave_rsq: rsq_mean,
                rsq_list: rsquares
            },
            clusters: clusters.length,
            centroids: new_clusters
        }
    )
}

kmeans = function(data, k = 2, cols = [], tol = 1e-2, maxiter = 1000){

    // now initiate clusters
    let clusters = init_clusters(k, usarrests);

    // iteration outputs
    var rsq = [];
    var ave_rsq = [];
    var ave_rsq_change = [];

    // begin iterations
    var last_rsq = 1e20;
    var rsq_change = Infinity;
    var iter = 1;

    while(rsq_change >= tol && iter <= maxiter){
        let err = [];

        // update clusters
        find_closest(data, clusters, cols);
        let new_clusters = update_clusters(data, clusters, cols);
        
        // compute for changes in clusters
        let rsquares = cluster_Rsq(data, new_clusters, cols);
        let iter_rsq = {};
        let rsq_sum = 0;
        for(let i = 0; i < new_clusters.length; i++){
            iter_rsq["cluster"+i] = rsquares[i].rsq;
            rsq_sum += rsquares[i].rsq;
        }

        // average within-group r square
        rsq_mean = rsq_sum / new_clusters.length;

        // move iterations
        iter += 1;
        rsq.push(iter_rsq);
        clusters = new_clusters;

        rsq_change = (last_rsq - rsq_mean)/Math.max(1,last_rsq);
        ave_rsq.push(rsq_mean);
        ave_rsq_change.push(rsq_change);
        last_rsq = rsq_mean;
    }

    return(
        {
            status: "successful",
            iterations: {
                num: iter,
                rsq_list: rsq,
                ave_rsq: ave_rsq,
                rsq_change: ave_rsq_change
            },
            clusters: clusters.length,
            centroids: clusters
        }
    )
}