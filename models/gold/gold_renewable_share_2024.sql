with latest_year_per_country as (
    -- Get the most recent year for each country
    select
        area,
        max(year) as latest_year
    from {{ ref("silver_global_energy_stats_clean") }}
    where
        area_type != 'Region' and
        category = 'Electricity generation' and
        unit = 'TWh'
    group by area
),

generation_data as (
    select
        s.area,
        s.iso_3_code,
        l.latest_year,
        sum(case when s.variable = 'Renewables' then s.value end) as renewables_twh,
        sum(case when s.variable = 'Total Generation' then s.value end) as total_generation_twh
    from {{ ref("silver_global_energy_stats_clean") }} s
    inner join latest_year_per_country l
        on s.area = l.area and s.year = l.latest_year
    where
        s.area_type != 'Region' and
        s.category = 'Electricity generation' and
        s.unit = 'TWh'
    group by
        s.area,
        s.iso_3_code,
        l.latest_year
)

select
    area,
    iso_3_code,
    latest_year,
    renewables_twh,
    total_generation_twh,
    round((renewables_twh * 100) / total_generation_twh, 2) as renewables_pct_generation
from generation_data
order by renewables_pct_generation desc