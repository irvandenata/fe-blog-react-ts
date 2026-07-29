import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setMenu } from "@/redux/slices/menuSlice";
import { seoConfig as bundledConfig, type SeoSiteConfig } from "@/utils/seo";

const ENDPOINT = "/__seo-config";

const inputClass =
    "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary";
const labelClass = "mb-2 block text-sm font-medium text-black dark:text-white";

/** Comma-separated string <-> string[] for keyword and profile fields. */
const toList = (value: string): string[] =>
    value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

interface FieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    hint?: string;
    placeholder?: string;
    multiline?: boolean;
    maxLength?: number;
}

const Field = ({
    label,
    value,
    onChange,
    hint,
    placeholder,
    multiline,
    maxLength,
}: FieldProps) => (
    <div>
        <label className={labelClass}>
            {label}
            {maxLength && (
                <span
                    className={`ml-2 text-xs font-normal ${
                        value.length > maxLength ? "text-red-500" : "text-bodydark"
                    }`}
                >
                    {value.length}/{maxLength}
                </span>
            )}
        </label>
        {multiline ? (
            <textarea
                rows={3}
                className={inputClass}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        ) : (
            <input
                type="text"
                className={inputClass}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        )}
        {hint && <p className="mt-1 text-xs text-bodydark">{hint}</p>}
    </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">{title}</h3>
        </div>
        <div className="flex flex-col gap-5 p-6.5">{children}</div>
    </div>
);

/**
 * Editor for public/seo-config.json — the single source of SEO defaults for
 * meta tags, Open Graph, Twitter cards, JSON-LD, and the sitemap.
 *
 * Saving writes the file directly under `npm run dev`. A production build has
 * no writable endpoint, so the form falls back to downloading the JSON for the
 * user to commit and redeploy.
 */
const SeoPage = () => {
    const dispatch = useDispatch();
    const [config, setConfig] = useState<SeoSiteConfig>(bundledConfig);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        dispatch(setMenu("SEO"));
    }, [dispatch]);

    // Prefer the on-disk file so edits from a previous session appear even
    // before the dev server restarts and rebundles the JSON import.
    useEffect(() => {
        fetch(ENDPOINT)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error("unavailable"))))
            .then((data) => setConfig(data))
            .catch(() => {
                /* Not in dev: the bundled config is already loaded. */
            });
    }, []);

    const set = <K extends keyof SeoSiteConfig>(key: K, value: SeoSiteConfig[K]) =>
        setConfig((prev) => ({ ...prev, [key]: value }));

    const setPage = (key: "home" | "blogs", field: string, value: string | string[]) =>
        setConfig((prev) => ({
            ...prev,
            pages: {
                ...prev.pages,
                [key]: { ...prev.pages[key], [field]: value },
            },
        }));

    const download = () => {
        const blob = new Blob([`${JSON.stringify(config, null, 2)}\n`], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "seo-config.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });
            if (!res.ok) throw new Error(`Save failed (${res.status})`);
            toast.success("Tersimpan ke public/seo-config.json");
        } catch {
            // Expected on a production build: no dev endpoint exists there.
            download();
            toast(
                "Tidak bisa menulis file dari build produksi. File JSON diunduh — " +
                    "letakkan di public/seo-config.json lalu deploy ulang.",
                { duration: 8000 }
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-warning/10 p-4 text-sm dark:border-strokedark">
                <p className="text-black dark:text-white">
                    Perubahan di sini menulis <code>public/seo-config.json</code>. Nilai
                    ini dipakai untuk meta tag, Open Graph, Twitter card, JSON-LD, dan
                    sitemap. Jalankan build ulang agar halaman statis ikut diperbarui.
                </p>
            </div>

            <Section title="Identitas Situs">
                <Field
                    label="Nama Situs"
                    value={config.siteName}
                    onChange={(v) => set("siteName", v)}
                />
                <Field
                    label="URL Situs"
                    value={config.siteUrl}
                    onChange={(v) => set("siteUrl", v.replace(/\/+$/, ""))}
                    hint="Tanpa garis miring di akhir. Dipakai untuk canonical dan sitemap."
                    placeholder="https://ivd.my.id"
                />
                <Field
                    label="Locale"
                    value={config.locale}
                    onChange={(v) => set("locale", v)}
                    hint="Contoh: id_ID atau en_US."
                />
                <Field
                    label="Template Judul"
                    value={config.titleTemplate}
                    onChange={(v) => set("titleTemplate", v)}
                    hint="%s diganti judul halaman. Contoh: %s | Irvan Denata"
                />
            </Section>

            <Section title="Meta Default">
                <Field
                    label="Judul Default"
                    value={config.defaultTitle}
                    onChange={(v) => set("defaultTitle", v)}
                    maxLength={60}
                    hint="Dipakai saat halaman tidak punya judul sendiri."
                />
                <Field
                    label="Deskripsi Default"
                    value={config.defaultDescription}
                    onChange={(v) => set("defaultDescription", v)}
                    multiline
                    maxLength={160}
                />
                <Field
                    label="Keyword Default"
                    value={config.defaultKeywords.join(", ")}
                    onChange={(v) => set("defaultKeywords", toList(v))}
                    hint="Pisahkan dengan koma."
                />
                <Field
                    label="Gambar Default (OG image)"
                    value={config.defaultImage}
                    onChange={(v) => set("defaultImage", v)}
                    hint="Ukuran ideal 1200×630 px. Path relatif (/og-image.png) atau URL penuh."
                />
                <Field
                    label="Robots"
                    value={config.robots}
                    onChange={(v) => set("robots", v)}
                    hint="Default: index, follow, max-image-preview:large, max-snippet:-1"
                />
            </Section>

            <Section title="Penulis & Profil">
                <Field
                    label="Nama Penulis"
                    value={config.author.name}
                    onChange={(v) => set("author", { ...config.author, name: v })}
                />
                <Field
                    label="Jabatan"
                    value={config.author.jobTitle || ""}
                    onChange={(v) => set("author", { ...config.author, jobTitle: v })}
                />
                <Field
                    label="Profil Sosial (sameAs)"
                    value={(config.author.sameAs || []).join(", ")}
                    onChange={(v) => set("author", { ...config.author, sameAs: toList(v) })}
                    hint="URL profil dipisah koma. Dipakai di structured data Person."
                />
                <Field
                    label="Nama Organisasi"
                    value={config.organization.name}
                    onChange={(v) =>
                        set("organization", { ...config.organization, name: v })
                    }
                />
                <Field
                    label="Logo Organisasi"
                    value={config.organization.logo}
                    onChange={(v) =>
                        set("organization", { ...config.organization, logo: v })
                    }
                />
            </Section>

            <Section title="Twitter Card">
                <Field
                    label="Tipe Card"
                    value={config.twitter.card}
                    onChange={(v) => set("twitter", { ...config.twitter, card: v })}
                    hint="summary_large_image atau summary."
                />
                <Field
                    label="Akun Situs (@)"
                    value={config.twitter.site || ""}
                    onChange={(v) => set("twitter", { ...config.twitter, site: v })}
                    placeholder="@username"
                />
                <Field
                    label="Akun Penulis (@)"
                    value={config.twitter.creator || ""}
                    onChange={(v) => set("twitter", { ...config.twitter, creator: v })}
                    placeholder="@username"
                />
            </Section>

            <Section title="Verifikasi Search Engine">
                <Field
                    label="Google Search Console"
                    value={config.verification.google || ""}
                    onChange={(v) =>
                        set("verification", { ...config.verification, google: v })
                    }
                />
                <Field
                    label="Bing Webmaster"
                    value={config.verification.bing || ""}
                    onChange={(v) =>
                        set("verification", { ...config.verification, bing: v })
                    }
                />
                <Field
                    label="Yandex"
                    value={config.verification.yandex || ""}
                    onChange={(v) =>
                        set("verification", { ...config.verification, yandex: v })
                    }
                />
            </Section>

            <Section title="Halaman: Beranda">
                <Field
                    label="Judul"
                    value={config.pages.home?.title || ""}
                    onChange={(v) => setPage("home", "title", v)}
                    maxLength={60}
                />
                <Field
                    label="Deskripsi"
                    value={config.pages.home?.description || ""}
                    onChange={(v) => setPage("home", "description", v)}
                    multiline
                    maxLength={160}
                />
                <Field
                    label="Keyword"
                    value={(config.pages.home?.keywords || []).join(", ")}
                    onChange={(v) => setPage("home", "keywords", toList(v))}
                />
            </Section>

            <Section title="Halaman: Blog">
                <Field
                    label="Judul"
                    value={config.pages.blogs?.title || ""}
                    onChange={(v) => setPage("blogs", "title", v)}
                    maxLength={60}
                />
                <Field
                    label="Deskripsi"
                    value={config.pages.blogs?.description || ""}
                    onChange={(v) => setPage("blogs", "description", v)}
                    multiline
                    maxLength={160}
                />
                <Field
                    label="Keyword"
                    value={(config.pages.blogs?.keywords || []).join(", ")}
                    onChange={(v) => setPage("blogs", "keywords", toList(v))}
                />
            </Section>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={download}
                    className="rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                    Unduh JSON
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 disabled:opacity-60"
                >
                    {isSaving ? "Menyimpan…" : "Simpan"}
                </button>
            </div>
        </form>
    );
};

export default SeoPage;
