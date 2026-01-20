{{  config(materialized = 'table') }} 

select 
    "Area" as area,
    "Iso 3 Code" as iso_3_code,
    "Year" as "year",
    "Area type" as area_type,
    "Continent" as continent,
    "Ember region" as ember_region,
    "EU" as eu,
    "OECD" as oecd,
    "G20" as g20,
    "G7" as g7,
    "ASEAN" as asean,
    "Category" as category,
    "Subcategory" as subcategory,
    "Variable" as variable,
    "Unit" as unit,
    "Value" as "value",
    "YoY absolute change" as yoy_abs_change,
    "YoY % change" as yoy_pct_change
from {{ ref('bronze_global_energy_stats')}}
