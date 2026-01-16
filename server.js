import express from "express";
import axios from "axios";
import "dotenv/config";

const app = express();
app.use(express.json());

// ===== SEGURANÇA SIMPLES (senha do GPT) =====
app.use((req, res, next) => {
  const apiKey = req.header("X-API-Key");
  if (!apiKey || apiKey !== process.env.X_API_KEY) {
    return res.status(401).json({ error: "Chave inválida" });
  }
  next();
});

// ===== ROTA DE TESTE (IMPORTANTE) =====
app.get("/", (req, res) => {
  res.send("API do Agente de Viagens funcionando 🚗✈️");
});

// ===== PLANO DE VIAGEM (VERSÃO SIMPLES) =====
app.post("/v1/trip/plan", async (req, res) => {
  try {
    const {
      origin,
      destination,
      vehicle,
      travel_policy
    } = req.body;

    // Distância fictícia (por enquanto)
    const distanceKm = 210;

    // Combustível
    const kmPerLiter = vehicle.km_per_liter_highway;
    const fuelPrice = vehicle.fuel_price_per_liter_brl;
    const liters = distanceKm / kmPerLiter;
    const fuelCost = liters * fuelPrice;

    // Custos fixos
    const meals =
      travel_policy.lunch_brl + travel_policy.dinner_brl;

    const hotel = travel_policy.hotel_avg_brl;

    const total =
      fuelCost + meals + hotel;

    res.json({
      summary: "Plano de viagem gerado com sucesso",
      route: {
        origin,
        destination,
        distance_km: distanceKm
      },
      fuel: {
        liters_estimated: liters.toFixed(2),
        total_brl: fuelCost.toFixed(2)
      },
      costs: {
        meals_brl: meals,
        hotel_brl: hotel,
        total_brl: total.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar viagem" });
  }
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
