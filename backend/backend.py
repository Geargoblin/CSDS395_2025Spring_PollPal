from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# List of 10 places in Cleveland with real image URLs
places = [
    {
        "name": "Rock & Roll Hall of Fame",
        "description": "A museum dedicated to preserving the history of rock music.",
        "image": "https://ohiomagazine.imgix.net/sitefinity/images/default-source/articles/2018/04---april-2018/rock-and-roll-hall-of-fame.jpg?sfvrsn=cdf2ab38_4&w=960&auto=compress%2cformat"
    },
    {
        "name": "West Side Market",
        "description": "Historic public market with fresh produce and artisanal foods.",
        "image": "https://cdn.prod.website-files.com/582efd75e6a8159513741627/582f57dce6a8159513757b8b_Market2.jpg"
    },
    {
        "name": "Cleveland Museum of Art",
        "description": "A world-class museum featuring a diverse collection of artworks.",
        "image": "https://www.universitycircle.org/files/locations/slider/cmabenefitallpeoplebanners.jpg"
    },
    {
        "name": "Cleveland Metroparks Zoo",
        "description": "A massive zoo with a rainforest exhibit and exotic animals.",
        "image": "https://www.cleveland.com/resizer/v2/EHSJDX3UQZFIDGPRXZ2QHY6CBM.jpeg?auth=94b62f93d5c4592373658325d0e9cab9fd1f00a1d9357c9e47fd5a49a54121d3&width=1280&quality=90"
    },
    {
        "name": "Great Lakes Science Center",
        "description": "A museum dedicated to science, technology, and space exploration.",
        "image": "https://images.axios.com/gG3fR7KzDJQTcXEtClqOr0mJ7XI=/0x126:5456x3195/1920x1080/2024/02/22/1708620325715.jpg?w=3840"
    },
    {
        "name": "Edgewater Park",
        "description": "A beautiful park along Lake Erie with beaches and scenic views.",
        "image": "https://playeasy.com/cdn-cgi/image/width=3840,fit=scale-down,format=auto,quality=85,background=white/https://storage.playeasy.com/facility-mgmt/523bd1f0-0bc1-46af-ba6d-cd43c7d3adde"
    },
    {
        "name": "Progressive Field",
        "description": "Home stadium of the Cleveland Guardians baseball team.",
        "image": "https://static.wixstatic.com/media/1de578_ff607606645643b39561f28eac0c39de~mv2.jpg/v1/fill/w_1016,h_762,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1de578_ff607606645643b39561f28eac0c39de~mv2.jpg"
    },
    {
        "name": "Playhouse Square",
        "description": "The largest performing arts center outside of New York City.",
        "image": "https://www.dlrgroup.com/media/2021/06/25_00088_00_N4_weblg-2140x1281.jpg"
    },
    {
        "name": "University Circle",
        "description": "A cultural hub with museums, gardens, and Case Western Reserve University.",
        "image": "https://dailymedia.case.edu/wp-content/uploads/2016/08/19140754/CWRU-university-circle.jpg"
    },
    {
        "name": "The Flats",
        "description": "An entertainment district with waterfront dining and nightlife.",
        "image": "https://scontent.fbkl1-1.fna.fbcdn.net/v/t39.30808-6/296404277_5842436765784617_7542443823342321004_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=Eam24OkVIEgQ7kNvgHPz640&_nc_oc=Adh1nzOBU2fBmwkKwkx3knwt4DehnJP8A5Sh77uXUu1Ughs7cWvtY8Zn-EvOf_70RPU&_nc_zt=23&_nc_ht=scontent.fbkl1-1.fna&_nc_gid=A8U3VraZFW4rU1-PIlitw9y&oh=00_AYGarNt-KnZSPx1u3PIE5XYaI_pKGnmMpDAjQSejtX5Eag&oe=67D0152F"
    }
]

@app.route('/places', methods=['GET'])
def get_places():
    return jsonify(places)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
