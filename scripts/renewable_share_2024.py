import duckdb
import plotly.express as px

con = duckdb.connect('energy_tracker.duckdb')
df = con.sql("SELECT * FROM gold_renewable_share_2024").df()
con.close()

fig = px.choropleth(
    df,
    locations="iso_3_code",
    color="renewables_pct_generation",
    hover_name="renewables_pct_generation",
    color_continuous_scale=["red", "yellow", "green"],
    range_color=[0, 100],
    title="Renewable Energy Generation Percentage per Country in 2024"
)

# 3. Show the map
fig.show()
