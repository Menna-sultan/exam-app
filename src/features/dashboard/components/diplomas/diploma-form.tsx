import type { Diploma } from "@/features/main/apis/diploma.api";
import { ImageDropzone } from "../image-dropzone";


export function DiplomaForm({
  diploma,
  action,
}: {
  diploma?: Diploma;
  action: (formData: FormData) => Promise<void>;
}) {
  const field = "w-full border px-3 py-3 text-sm outline-none focus:border-blue-600";
  return (
    <form id="diploma-form" action={action} className="bg-white">
      <h2 className="bg-blue-600 px-2.5 py-2.5 font-medium text-white">Diploma Information</h2>
      <div className="space-y-6 p-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Image</label>
          <ImageDropzone name="image" defaultUrl={diploma?.image} />
        </div>
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium">Title</label>
          <input id="title" name="title" defaultValue={diploma?.title} required className={field} />
        </div>
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label>
          <textarea id="description" name="description" rows={5} defaultValue={diploma?.description} className={field} />
        </div>
      </div>
    </form>
  );
}