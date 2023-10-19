const express =  require("express");
const app = express();
const fs = require("fs");
const { parse } = require("csv-parse");
const natural = require('natural');
const ed = require('edit-distance');
const request = require('request');

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);

app.use(express.json());

//Making a get request
const search_recipe_default_url = "https://cosylab.iiitd.edu.in/api/recipeDB/searchrecipe";
const get_token_url = "https://cosylab.iiitd.edu.in/api/auth/realms/bootadmin/protocol/openid-connect/token";

//---------------------------------------------------------NLP--------------------------------------------------------------------
// Define cost functions.
var insert, remove, update;
insert = remove = function(node) { return 1; };
update = function(stringA, stringB) { return stringA !== stringB ? 1 : 0; };

const continents_list = ["African","Australasian","Latin American","European","North American","Asian"]
const category_list = []
const ingredient_list = []
const processes_list = []
const utensils_list = []
const countries_list = []

fs.createReadStream("./NER_Models/RecipeDB_category_unique.csv").pipe(parse({ delimiter: ",", from_line: 2 })).on("data", function (row) {
    const temp = row[0].trim()
    category_list.push(temp)
})
fs.createReadStream("./NER_Models/RecipeDB_ing_v1_unique.csv").pipe(parse({ delimiter: ",", from_line: 2 })).on("data", function (row) {
    const temp = row[1].trim()
    ingredient_list.push(temp)
})
fs.createReadStream("./NER_Models/RecipeDB_processes_unique.csv").pipe(parse({ delimiter: ",", from_line: 2 })).on("data", function (row) {
    const temp = row[1].trim()
    processes_list.push(temp)
})
fs.createReadStream("./NER_Models/RecipeDB_subregion_unique.csv").pipe(parse({ delimiter: ",", from_line: 2 })).on("data", function (row) {
    const temp = row[0].trim()
    countries_list.push(temp)
})
fs.createReadStream("./NER_Models/RecipeDB_utensil_unique.csv").pipe(parse({ delimiter: ",", from_line: 2 })).on("data", function (row) {
    const temp = row[1].trim()
    utensils_list.push(temp)
})
function findWordInWhichDict(word){
    //console.log("The word is: "+word);
    const category_vals = []
    for (let query_word of category_list) {
        const qw = query_word.trim();
        const dist = ed.levenshtein(qw, word,insert,remove,update);
        category_vals.push(dist.distance);
    }
    const edit_length_to_be_waved = 1;
    const len_word = 4;
    let min_val = Math.min(...category_vals);
    let min_ind = category_vals.indexOf(min_val);
    let query_word = category_list[min_ind];
    if((min_val==0) || (min_val<=edit_length_to_be_waved && word.length>len_word)){
        return ["category",query_word];
    }
    //category finished

    const countries_vals = []
    for (let query_word of countries_list) {
        const qw = query_word.trim();
        const dist = ed.levenshtein(qw.toLowerCase(), word,insert,remove,update);
        countries_vals.push(dist.distance);
    }
    min_val = Math.min(...countries_vals);
    min_ind = countries_vals.indexOf(min_val);
    query_word = countries_list[min_ind];
    if((min_val==0) || (min_val<=edit_length_to_be_waved && word.length>len_word)){
        return ["country",query_word];
    }
    //countries finished

    const ingredients_vals = []
    for (let query_word of ingredient_list) {
        const qw = query_word.trim();
        const dist = ed.levenshtein(qw, word,insert,remove,update);
        ingredients_vals.push(dist.distance);
        // var mind = 10000;
        // for(let wrd of query_word_list){
        //     const qw = wrd.trim();
        //     const dist = ed.levenshtein(qw, word,insert,remove,update);
        //     if(dist.distance<mind){
        //         mind = dist.distance;
        //     }
        // }
        
    }
    min_val = Math.min(...ingredients_vals);
    min_ind = ingredients_vals.indexOf(min_val);
    query_word = ingredient_list[min_ind];
    if((min_val==0) || (min_val<=edit_length_to_be_waved && word.length>len_word)){
        return ["ingredient",query_word];
    }
    //ingredients finished

    const process_vals = []
    for (let query_word of processes_list) {
        const qw = query_word.trim();
        const dist = ed.levenshtein(qw, word,insert,remove,update);
        process_vals.push(dist.distance);
    }
    min_val = Math.min(...process_vals);
    min_ind = process_vals.indexOf(min_val);
    query_word = processes_list[min_ind];
    if((min_val==0) || (min_val<=edit_length_to_be_waved && word.length>len_word)){
        return ["cookingProcess",query_word];
    }
    //processes finished

    const utensils_vals = []
    for (let query_word of utensils_list) {
        const qw = query_word.trim();
        const dist = ed.levenshtein(qw, word,insert,remove,update);
        utensils_vals.push(dist.distance);
    }
    min_val = Math.min(...utensils_vals);
    min_ind = utensils_vals.indexOf(min_val);
    query_word = utensils_list[min_ind];
    if((min_val==0) || (min_val<=edit_length_to_be_waved && word.length>len_word)){
        return ["utensil",query_word];
    }
    //utensils finished

    const continents_vals = []
    for (let query_word of continents_list) {
        const qw = query_word.trim();
        const dist = ed.levenshtein(qw, word,insert,remove,update);
        continents_vals.push(dist.distance);
    }
    min_val = Math.min(...continents_vals);
    min_ind = continents_vals.indexOf(min_val);
    query_word = continents_list[min_ind];
    if((min_val==0) || (min_val<=edit_length_to_be_waved && word.length>len_word)){
        return ["continents",query_word];
    }
    //continents finished    

    return [-1,-1];
}
//Extract features from query text
function extractFeaturesFromQueryTextAndCreateRequest(text){
    //const tokenizer = new natural.WordTokenizer();
    //console.log(tokenizer.tokenize(text));
    const search_dict={"category":[],"ingredient":[],"cookingProcess":[],"utensil":[],"country":[],"continents":[]}

    text = text.toLowerCase();
    const text_list = text.split(" "); 
    let key,vals;
    var features = []
    const neg_words = ["no","not","without","except"]
    for (let i=0;i<text_list.length;i+=1) {
        // if(word=="no")
        const word = text_list[i];
        if(neg_words.includes(word)){
            continue;
        }
        const result_val = findWordInWhichDict(word);
        key = result_val[0];
        vals = result_val[1];

        // console.log(result_val)
        if(key == -1){
            continue;
        }
        features.push(vals)
        search_dict[key].push(vals);
        if(key=="ingredient" || key=="category"){
            search_dict[key].pop();
            var negate = false;
            var check_index = i-1;
            while(check_index>=0){
                const temp = text_list[check_index]
                if(features.includes(temp)){
                    break;
                }
                if(neg_words.includes(temp)){
                    negate = true;
                    break;
                }
                check_index -= 1;
            }

            if(negate){
                search_dict[key].push([vals,-1]);
            }
            else{
                search_dict[key].push([vals,1]);
            }
        }
    }    
    console.log(search_dict);
    return search_dict;
}
//---------------------------------------------------------------------------------------------------------------------------------
//API           
const axios = require('axios');
const qs = require('qs');
const data = qs.stringify({
    'client_id': 'app-ims',
    'grant_type': 'password',
    'username': 'manas',
    'password': 'manas_cosylab',
    'scope': 'openid' 
});
// {c:[[]],ing:[[onion,1-1]],continent:[india,au]}
function createRequestFromDict(search_dict,final_res){
    const keys = Object.keys(search_dict);
    for(let key of keys){
        if(search_dict[key].length==0){
            delete search_dict[key];
        }
    }
    var json_for_request = {}
    for(let key of Object.keys(search_dict)){
        const value = search_dict[key]
        if(!(key=="category" || key=="ingredient")){
            json_for_request[key] = value[0]
        }
        else{
            if(value[0][1]==1){
                json_for_request[key+"Used"] = value[0][0]
            }
            else if(value[0][1]==-1){
                json_for_request[key+"NotUsed"] = value[0][0];
            }
        }
    }
    console.log(json_for_request);
    const config = {
        method: 'post',
        url: 'https://cosylab.iiitd.edu.in/api/auth/realms/bootadmin/protocol/openid-connect/token',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };
    axios(config).then(function (response) {
        var bearer_tokn = JSON.stringify(response.data);
        bearer_tokn = bearer_tokn.split(":")[1].split(',"expires_in"')[0].split('"')[1];
        const c = {
            method: 'get',
            url: 'https://cosylab.iiitd.edu.in/api/recipeDB/searchrecipe',
            params:json_for_request, 
            headers: { 
              'Authorization': "Bearer".concat(" ", bearer_tokn), 
            },
           // 'params':json_for_request
        };
        //console.log(bearer_tokn);
        axios(c).then(function (response) {
            //console.log(response.data[0]);
            final_res.send(response.data);
        });
    });
    
}
function RecipeInfo(id,final_res){
    const recipe_info_url = "https://cosylab.iiitd.edu.in/api/recipeDB/recipeInfo/";
    const config = {
        method: 'post',
        url: 'https://cosylab.iiitd.edu.in/api/auth/realms/bootadmin/protocol/openid-connect/token',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };
    axios(config).then(function (response) {
        var bearer_tokn = JSON.stringify(response.data);
        bearer_tokn = bearer_tokn.split(":")[1].split(',"expires_in"')[0].split('"')[1];
        const c = {
            method: 'get',
            url: recipe_info_url+String(id),
            headers: { 
              'Authorization': "Bearer".concat(" ", bearer_tokn), 
            }
        };
        axios(c).then(function (response) {
            //console.log(response.data);
            final_res.send(response.data);
        });
    });

}
function GetIngredientsByRecipe(id,final_res){
    const get_ingredients_recipe_url = "https://cosylab.iiitd.edu.in/api/recipeDB/getingredientsbyrecipe/";
    const config = {
        method: 'post',
        url: 'https://cosylab.iiitd.edu.in/api/auth/realms/bootadmin/protocol/openid-connect/token',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };
    axios(config).then(function (response) {
        var bearer_tokn = JSON.stringify(response.data);
        bearer_tokn = bearer_tokn.split(":")[1].split(',"expires_in"')[0].split('"')[1];
        const c = {
            method: 'get',
            url: get_ingredients_recipe_url+String(id),
            headers: { 
              'Authorization': "Bearer".concat(" ", bearer_tokn), 
            }
        };
        axios(c).then(function (response) {
            //console.log(response.data);
            final_res.send(response.data);
        });
    });
}
function RecipeInstructions(id,final_res){
    const instructions_url = "https://cosylab.iiitd.edu.in/api/instructions/";
    const config = {
        method: 'post',
        url: 'https://cosylab.iiitd.edu.in/api/auth/realms/bootadmin/protocol/openid-connect/token',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };
    axios(config).then(function (response) {
        var bearer_tokn = JSON.stringify(response.data);
        bearer_tokn = bearer_tokn.split(":")[1].split(',"expires_in"')[0].split('"')[1];
        const c = {
            method: 'get',
            url: instructions_url+String(id),
            headers: { 
              'Authorization': "Bearer".concat(" ", bearer_tokn), 
            }
        };
        axios(c).then(function (response) {
            const text = response.data;
            var finaText = []
            var currText = text[0].toUpperCase();
            const textLength = text.length;
            for(let ij=1;ij<textLength;ij++){
                if(ij<textLength-1 && text[ij]==" " && (text[ij+1]=='.' || text[ij+1]==',' || text[ij+1]==';')){
                    continue;
                }
                if(text[ij]=='.'){
                    finaText.push(currText+'.');
                    currText = "";
                }
                if((ij>2 && text[ij-2]=='.' && text[ij-1]==' ') || (ij>1 && text[ij-1]=='.')){
                    if(text[ij].toLowerCase() != text[ij].toUpperCase()){
                        currText = "";
                        currText += text[ij].toUpperCase();
                    }
                    else{
                        continue;
                    }
                }
                else{
                    currText += text[ij];
                }
            }
            if(currText.length>0){
                finaText.push(currText);
            }
            final_res.send(finaText);
        });
    });
}
app.get('/api/findRecipeByText/:text',(req,final_res)=>{
    const search_dict = extractFeaturesFromQueryTextAndCreateRequest(req.params['text']);
    createRequestFromDict(search_dict,final_res);
});
app.get('/api/recipeDB/recipeInfo/:recipe_id',(req,final_res)=>{
    RecipeInfo(req.params['recipe_id'],final_res);
});
app.get('/api/recipeDB/getingredientsbyrecipe/:recipe_id',(req,final_res)=>{
    GetIngredientsByRecipe(req.params['recipe_id'],final_res);
});
app.get('/api/recipeDB/instructions/:recipe_id',(req,final_res)=>{
    RecipeInstructions(req.params['recipe_id'],final_res);
});
app.get('/',(req,res)=>{
    res.send("<h1>Hello World!</h1>");
});

app.listen(3002,()=>{
    console.log("Server running on port: 3002");
});