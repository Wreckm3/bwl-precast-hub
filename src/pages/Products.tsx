import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useProducts } from "@/hooks/useProducts";
import { formatKES } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Search, MessageCircle } from "lucide-react";
import concreteTexture from "@/assets/concrete-texture.jpg";

export default function Products() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedTransport, setSelectedTransport] = useState<Record<string, boolean>>({});

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const getTotal = (productId: string, basePrice: number, transportCost: number) => {
    return selectedTransport[productId] ? basePrice + transportCost : basePrice;
  };

  const handleWhatsApp = (product: { name: string; base_price: number; transport_cost: number }, useTransport: boolean) => {
    const total = useTransport ? product.base_price + product.transport_cost : product.base_price;
    const message = encodeURIComponent(
      `Hello! I'm interested in the ${product.name}.\n\nPrice: ${formatKES(product.base_price)}\nTransport: ${useTransport ? formatKES(product.transport_cost) : 'Own transport'}\nTotal: ${formatKES(total)}\n\nPlease provide more details.`
    );
    window.open(`https://wa.me/254799994758?text=${message}`, '_blank');
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="container-custom text-center">
          <p className="text-accent font-semibold uppercase tracking-widest mb-2">Our Products</p>
          <h1 className="heading-xl text-primary-foreground mb-4">Precast Concrete Solutions</h1>
          <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto">
            High-quality precast products with transparent pricing and delivery options
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container-custom">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
                  <div className="aspect-video bg-secondary relative">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src={concreteTexture} alt={product.name} className="w-full h-full object-cover opacity-50" />
                    )}
                    <Badge className={`absolute top-3 right-3 ${product.is_available ? 'bg-green-600' : 'bg-red-600'}`}>
                      {product.is_available ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl text-foreground mb-2">{product.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{product.description}</p>
                    
                    {/* Pricing */}
                    <div className="space-y-3 mb-4 p-4 bg-muted rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Package className="w-4 h-4" /> Product Price
                        </span>
                        <span className="font-semibold">{formatKES(product.base_price)}</span>
                      </div>
                      
                      {/* Transport Options */}
                      <div className="border-t border-border pt-3">
                        <p className="text-sm text-muted-foreground mb-2">Transport Option:</p>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`transport-${product.id}`}
                              checked={!selectedTransport[product.id]}
                              onChange={() => setSelectedTransport(prev => ({ ...prev, [product.id]: false }))}
                              className="accent-accent"
                            />
                            <span className="text-sm">Own transport (KES 0)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`transport-${product.id}`}
                              checked={selectedTransport[product.id]}
                              onChange={() => setSelectedTransport(prev => ({ ...prev, [product.id]: true }))}
                              className="accent-accent"
                            />
                            <span className="text-sm flex items-center gap-1">
                              <Truck className="w-4 h-4" /> BWL Transport ({formatKES(product.transport_cost)})
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-semibold">Total Estimate</span>
                        <span className="font-bold text-accent text-lg">
                          {formatKES(getTotal(product.id, product.base_price, product.transport_cost))}
                        </span>
                      </div>
                    </div>

                    <Button 
                      variant="accent" 
                      className="w-full"
                      onClick={() => handleWhatsApp(product, selectedTransport[product.id] || false)}
                    >
                      <MessageCircle className="w-4 h-4" /> Request Quote
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No products found</p>
              <p>Check back soon or contact us for custom orders.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
