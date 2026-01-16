import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

// ===============================
// SEGURANÇA SIMPLES (API KEY)
// ===============================
app.use((req, res, next) => {
  const apiKey = req.header("X-API-Key");

  if (!apiKey || apiKey !== process.env.X_API_KEY) {
    return res.status(401).json({ error: "Chave inválida" });
  }

  next();
});

// ===============================
// ROTA DE TESTE (CONFIRMA SE ESTÁ NO AR)
// ===============================
app.get("/", (req, res) => {
  res.send("API do Agente de Viagens funcionando 🚗✈️");
});

// ===============================
// ROTA PRINCIPAL (PLANO DE VIAGEM SIMPLES)
// ===============================
app.post("/v1/trip/plan", (req, res) => {
  try {
    const {
      origin,
      destination,
      vehicle,
      travel_policy
    } = req.body;

    // Distância fictícia (MVP)
    const distanceKm = 210;

    // Combustível
    const kmPerLiter = vehicle.km_per_liter_highway;
    const fuelPrice = vehicle.fuel_price_per_liter_brl;

    const liters = distanceKm / kmPerLiter;
    const fuelCost = liters * fuelPrice;

    // Custos fixos (política da empresa)
    const meals =
      travel_policy.lunch_brl +
      travel_policy.dinner_brl;

    const hotel = travel_policy.hotel_avg_brl;

    const total =
      fuelCost +
      meals +
      hotel;

    res.json({
      summary: "Plano de viagem gerado com sucesso",
      route: {
        origin,
        destination,
        distance_km: distanceKm
      },
      fuel: {
        liters_estimated: Number(liters.toFixed(2)),
        total_brl: Number(fuelCost.toFixed(2))
      },
      costs: {
        meals_brl: meals,
        hotel_brl: hotel,
        total_brl: Number(total.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao gerar plano de viagem"
    });
  }
});

// ===============================
// START DO SERVIDOR (RENDER)
// ===============================
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
