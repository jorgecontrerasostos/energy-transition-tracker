with generation_data as (
    select
        area,
        iso_3_code,
        sum(case when variable = 'Renewables' then value end) as renewables_twh,
        sum(case when variable = 'Total Generation' then value end) as total_generation_twh
    from {{ ref("silver_global_energy_stats_clean") }}
    where
        year = 2024 and
        area_type != 'Region' and
        category = 'Electricity generation' and
        unit = 'TWh'
    group by
        area,
        iso_3_code
)


select
    area,
    iso_3_code,
    renewables_twh,
    total_generation_twh,
    round((renewables_twh * 100) / total_generation_twh, 2) as renewables_pct_generation
from generation_data
order by renewables_pct_generation desc