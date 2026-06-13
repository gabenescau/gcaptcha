import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({ payerName: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentData, setPaymentData] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      setPaymentData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (paymentData?.copyPaste) {
      navigator.clipboard.writeText(paymentData.copyPaste)
      alert('Código copiado para a área de transferência!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-all">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Finalizar Pagamento</h1>
          <p className="text-indigo-100 mt-2 opacity-90">Rápido, seguro e sem complicações.</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {!paymentData ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="payerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="payerName"
                  name="payerName"
                  required
                  value={formData.payerName}
                  onChange={handleChange}
                  placeholder="Ex: João da Silva"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone (com DDD)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="input-field"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !formData.payerName || !formData.phone}
                  className="btn-primary relative"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    'Gerar PIX - R$ 29,81'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="inline-block p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                {/* Fallback caso não venha base64, mostrar um placeholder ou a imagem real */}
                {paymentData.qrCodeBase64 ? (
                  <img 
                    src={paymentData.qrCodeBase64.startsWith('data:image') ? paymentData.qrCodeBase64 : `data:image/png;base64,${paymentData.qrCodeBase64}`} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <span>QR Code indisponível</span>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Escaneie o QR Code ou copie o código Pix abaixo:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={paymentData.copyPaste || 'Código não disponível'}
                    className="flex-1 bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-600 focus:outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    disabled={!paymentData.copyPaste}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Copiar
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => { setPaymentData(null); setFormData({ payerName: '', phone: '' }) }}
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors mt-4 block w-full text-center"
              >
                Cancelar ou fazer novo pagamento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
