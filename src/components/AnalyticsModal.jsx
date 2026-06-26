import React, { useEffect, useRef, useState } from 'react'
import { Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function AnalyticsModal({ vendors, orders, onClose }) {
  const salesChartRef = useRef(null)
  const pieChartRef = useRef(null)

  // Calculate analytics data
  const analyticsData = React.useMemo(() => {
    // Sales Trends - Last 7 days
    const salesByDay = {}
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      salesByDay[dateStr] = 0
    }

    orders.forEach(order => {
      const dateStr = new Date(order.createdAt).toISOString().split('T')[0]
      if (salesByDay.hasOwnProperty(dateStr)) {
        salesByDay[dateStr] += order.amount * order.qty
      }
    })

    const salesLabels = Object.keys(salesByDay).map(date => {
      const d = new Date(date)
      return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
    })
    const salesValues = Object.values(salesByDay)

    // Top Products
    const productSales = {}
    orders.forEach(order => {
      const product = vendors
        .flatMap(v => v.products)
        .find(p => p.id === order.productId)
      if (product) {
        if (!productSales[product.title]) {
          productSales[product.title] = { sales: 0, qty: 0, category: product.category }
        }
        productSales[product.title].sales += order.amount * order.qty
        productSales[product.title].qty += order.qty
      }
    })

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    // Revenue by Category
    const categoryRevenue = {}
    vendors.forEach(vendor => {
      vendor.products.forEach(product => {
        const productOrders = orders.filter(o => o.productId === product.id)
        const revenue = productOrders.reduce((sum, o) => sum + o.amount * o.qty, 0)
        if (revenue > 0) {
          if (!categoryRevenue[product.category]) {
            categoryRevenue[product.category] = 0
          }
          categoryRevenue[product.category] += revenue
        }
      })
    })

    return {
      salesTrends: { labels: salesLabels, values: salesValues },
      topProducts,
      categoryRevenue
    }
  }, [vendors, orders])

  // Chart configurations
  const salesChartData = {
    labels: analyticsData.salesTrends.labels,
    datasets: [
      {
        label: 'Revenus ($)',
        data: analyticsData.salesTrends.values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  }

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: '#334155'
        },
        ticks: {
          color: '#94a3b8'
        }
      },
      y: {
        grid: {
          color: '#334155'
        },
        ticks: {
          color: '#94a3b8',
          callback: value => '$' + value
        }
      }
    }
  }

  const categoryChartData = {
    labels: Object.keys(analyticsData.categoryRevenue),
    datasets: [
      {
        data: Object.values(analyticsData.categoryRevenue),
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#f59e0b',
          '#10b981',
          '#ef4444'
        ],
        borderWidth: 0
      }
    ]
  }

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e2e8f0',
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return '$' + context.raw.toFixed(2)
          }
        }
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel analytics-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Analytics Dashboard</h3>
          <button type="button" className="btn ghost" onClick={onClose}>Fermer</button>
        </div>
        <div className="modal-body analytics-body">
          <div className="analytics-grid">
            {/* Sales Trends */}
            <div className="analytics-card">
              <h4>Sales Trends (7 jours)</h4>
              <div className="chart-container">
                <Line data={salesChartData} options={salesChartOptions} ref={salesChartRef} />
              </div>
            </div>

            {/* Top Products */}
            <div className="analytics-card">
              <h4>Top Products</h4>
              <div className="top-products-list">
                {analyticsData.topProducts.length === 0 ? (
                  <div className="empty-state">Aucune vente enregistrée</div>
                ) : (
                  analyticsData.topProducts.map((product, index) => (
                    <div key={index} className="top-product-item">
                      <div className="product-rank">#{index + 1}</div>
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-category">{product.category}</div>
                      </div>
                      <div className="product-stats">
                        <div className="product-sales">${product.sales.toFixed(2)}</div>
                        <div className="product-qty">{product.qty} vendus</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Revenue by Category */}
            <div className="analytics-card">
              <h4>Revenue by Category</h4>
              <div className="chart-container pie-container">
                <Pie data={categoryChartData} options={categoryChartOptions} ref={pieChartRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
