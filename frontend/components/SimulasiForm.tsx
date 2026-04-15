"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const logoIcon = "/logo-icon.png";

const API_URL = "http://localhost:8080";

type FormState = "idle" | "loading" | "success" | "error";

interface TransactionResult {
  nama_transaksi: string;
  nominal: number;
  kategori: string;
}

const SimulasiForm = () => {
  const [namaTransaksi, setNamaTransaksi] = useState("");
  const [nominal, setNominal] = useState("");
  const [kategori, setKategori] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [budget] = useState(2000000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaTransaksi.trim()) {
      setFormState("error");
      setMessage("Nama transaksi wajib diisi.");
      return;
    }
    if (!nominal || Number(nominal) <= 0) {
      setFormState("error");
      setMessage("Nominal harus lebih besar dari 0.");
      return;
    }
    if (!kategori) {
      setFormState("error");
      setMessage("Kategori wajib dipilih.");
      return;
    }

    setFormState("loading");
    setMessage("");

    const payload = {
      nama_transaksi: namaTransaksi.trim(),
      nominal: Number(nominal),
      kategori,
    };

    try {
      const res = await fetch(`${API_URL}/api/v1/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "success") {
        setFormState("success");
        setMessage(data.message || "Transaksi Berhasil Dicatat");
        setResult(payload);
        setNamaTransaksi("");
        setNominal("");
        setKategori("");
      } else {
        setFormState("error");
        setMessage(data.message || "Terjadi kesalahan.");
      }
    } catch {
      setFormState("error");
      setMessage("Tidak dapat terhubung ke server. Pastikan backend berjalan di localhost:8080.");
    }
  };

  const isLoading = formState === "loading";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
      {/* Form Column */}
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          {/* Logo in form */}
          <div className="flex items-center gap-3 mb-8">
            <img src={logoIcon} alt="Finastriva" className="h-10 w-10" />
            <div>
              <p className="font-bold text-foreground text-lg tracking-tight">FINASTRIVA</p>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Simplified Financial Management</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nama_transaksi" className="text-sm font-semibold">
                Nama Transaksi
              </Label>
              <Input
                id="nama_transaksi"
                type="text"
                placeholder="Contoh: Beli Kopi"
                value={namaTransaksi}
                onChange={(e) => setNamaTransaksi(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nominal" className="text-sm font-semibold">
                Nominal (Rp)
              </Label>
              <Input
                id="nominal"
                type="number"
                placeholder="50000"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                disabled={isLoading}
                min={1}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori" className="text-sm font-semibold">
                Kategori
              </Label>
              <Select value={kategori} onValueChange={setKategori} disabled={isLoading}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                  <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Submit Transaksi"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Sidebar Column */}
      <div className="space-y-6">
        {/* Budget Widget */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Sisa Budget</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            Rp {budget.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Success State */}
        {formState === "success" && result && (
          <div className="bg-success rounded-xl border border-success-foreground/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-success-foreground flex-shrink-0" />
              <p className="font-semibold text-success-foreground text-sm">{message}</p>
            </div>
            <p className="text-xs text-success-foreground/80 ml-7">{result.nama_transaksi} — Rp {result.nominal.toLocaleString("id-ID")}</p>
          </div>
        )}

        {/* Error State */}
        {formState === "error" && (
          <div className="bg-destructive/10 rounded-xl border border-destructive/20 p-5">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="font-semibold text-destructive text-sm">{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulasiForm;
