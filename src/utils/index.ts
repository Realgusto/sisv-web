export const format = (value: number, isCurrency: boolean = true) => {
  if (isCurrency) {
    if (value >= 1000000) {
      const abbreviated = (value / 1000000).toFixed(1)
      // Remove o .0 quando não há decimais
      const finalValue = abbreviated.endsWith('.0') 
        ? abbreviated.slice(0, -2) 
        : abbreviated
      return `R$ ${finalValue}M`
    }
    
    if (value >= 1000) {
      const abbreviated = (value / 1000).toFixed(1)
      // Remove o .0 quando não há decimais
      const finalValue = abbreviated.endsWith('.0') 
        ? abbreviated.slice(0, -2) 
        : abbreviated
      return `R$ ${finalValue}K`
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  } else {
    // Formatação para valores não monetários
    if (value >= 1000000) {
      const abbreviated = (value / 1000000).toFixed(1)
      const finalValue = abbreviated.endsWith('.0') 
        ? abbreviated.slice(0, -2) 
        : abbreviated
      return `${finalValue}M`
    } else if (value >= 1000) {
      const abbreviated = (value / 1000).toFixed(1)
      const finalValue = abbreviated.endsWith('.0') 
        ? abbreviated.slice(0, -2) 
        : abbreviated
      return `${finalValue}K`
    }
    return value.toString() // Retorna o valor como string se não for K ou M
  }
}

export const formatZero = (value: number, length: number) => {
  if (value === 0) {
    return '0'.repeat(length)
  }
  return value.toString().padStart(length, '0')
}

export const formatStatus = (statusStr: string) => {
  return statusStr.replace(/_/g, ' ').toUpperCase()
}