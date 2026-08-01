const map=new maplibregl.Map({
 container:'map',
 style:'https://demotiles.maplibre.org/style.json',
 center:[77.5946,12.9716],
 zoom:10
});
map.addControl(new maplibregl.NavigationControl());

let marker=null;

async function searchPlace(){
 const q=document.getElementById('search').value.trim();
 if(!q) return;
 const r=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(q));
 const d=await r.json();
 if(!d.length){alert('Place not found');return;}
 const p=d[0];
 const lng=+p.lon, lat=+p.lat;
 map.flyTo({center:[lng,lat],zoom:13});
 if(marker) marker.remove();
 marker=new maplibregl.Marker().setLngLat([lng,lat]).addTo(map);
 document.getElementById('card').innerHTML='<b>'+p.display_name+'</b>';
}
document.getElementById('go').addEventListener('click',searchPlace);
document.getElementById('search').addEventListener('keydown',e=>{if(e.key==='Enter')searchPlace();});
