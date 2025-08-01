# Transições Admin vs Públicas

## 📋 **Estrutura das Transições**

### **Páginas Públicas**
- **Componente**: `PageTransition.tsx`
- **Estilo**: Transição elaborada com logo e barra de progresso
- **Duração**: 1000ms
- **Uso**: Automático via layout principal

### **Páginas Admin Login**
- **Componente**: `AdminLoginTransition.tsx` 
- **Estilo**: Fade simples com escala
- **Duração**: 300ms
- **Uso**: Via layout `/admin/login/layout.tsx`

### **Páginas Admin Dashboard**
- **Componente**: `AdminDashboardSkeleton.tsx`
- **Estilo**: Skeleton loading completo
- **Duração**: 400ms
- **Uso**: Via `AdminGuard.tsx`

## 🎯 **Como Funciona**

### **Fluxo de Navegação:**

1. **Página Pública → Página Pública**
   ```
   PageTransition com logo e animação completa
   ```

2. **Página Pública → Admin Login**
   ```
   AdminLoginTransition - fade simples
   ```

3. **Admin Login → Admin Dashboard**
   ```
   AdminDashboardSkeleton - skeleton completo
   ```

4. **Admin Dashboard → Admin Dashboard**
   ```
   AdminDashboardSkeleton - skeleton de transição
   ```

## 🚀 **Benefícios**

- ✅ **Separação de contextos**: Admin vs Público
- ✅ **Performance**: Transições mais leves para admin
- ✅ **UX adequada**: Skeleton para dashboards, animação para público
- ✅ **Manutenibilidade**: Componentes específicos para cada uso