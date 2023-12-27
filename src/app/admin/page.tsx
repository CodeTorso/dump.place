import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { deleteDump } from "../actions";
import { env } from "@/env";

export default async function Page() {

  const auth = await getServerAuthSession();

  if (auth?.user.email !== env.ADMIN_EMAIL) {
    notFound()
  }
  const dumps = await db.dumps.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="item-center flex justify-center">
      <div className="w-96 max-w-2xl">

        <ul className="gap-4">
          {dumps.map((dump) => (
            <li className="w-full" key={dump.id}>
              <div className="mt-8 rounded-xl border p-4 dark:border-gray-500">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex text-sm text-gray-500 dark:text-gray-400">
                      {new Date(dump.createdAt).toLocaleString("en-US", {
                        day: "numeric",
                        month: "long",
                      })}
                      {"  "}
                      {new Date(dump.createdAt).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </div>
                  </div>

                  {auth?.user.email === env.ADMIN_EMAIL && (
                    <DeleteButton id={dump.id} />
                  )}
                </div>
                <div className="prose-slate text-md prose-h1:text-xl prose-h2:text-lg mt-4">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {dump.content}
                  </Markdown>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DeleteButton({ id }: { id: number }) {
  return (
    <Button
        onClick={() => {
          deleteDump(id);
        }}
        className="bin px-2 py-1 flex flex-col items-center justify-center"
        size="sm"
        variant="secondary" 
    >
        <svg className="w-4" viewBox="0 0 26 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.08 0H15.5867C15.876 0 16.128 1.53979e-07 16.3653 0.0373335C16.8276 0.111391 17.2661 0.292615 17.6458 0.566509C18.0255 0.840402 18.3359 1.19936 18.552 1.61467C18.664 1.828 18.7427 2.06667 18.8347 2.34L18.9827 2.78667C19.0848 3.14955 19.3069 3.4671 19.6127 3.68747C19.9186 3.90784 20.2901 4.01801 20.6667 4H24.6667C24.9319 4 25.1862 4.10536 25.3738 4.29289C25.5613 4.48043 25.6667 4.73478 25.6667 5C25.6667 5.26522 25.5613 5.51957 25.3738 5.70711C25.1862 5.89464 24.9319 6 24.6667 6H2C1.73478 6 1.48043 5.89464 1.29289 5.70711C1.10536 5.51957 1 5.26522 1 5C1 4.73478 1.10536 4.48043 1.29289 4.29289C1.48043 4.10536 1.73478 4 2 4H6.12C6.47614 3.99146 6.82017 3.86903 7.10164 3.65067C7.38311 3.43231 7.58721 3.1295 7.684 2.78667L7.83333 2.34C7.924 2.06667 8.00267 1.828 8.11333 1.61467C8.32959 1.1992 8.64012 0.840137 9.02007 0.566234C9.40001 0.292331 9.83881 0.111196 10.3013 0.0373335C10.5387 1.53979e-07 10.7907 0 11.0787 0M9.34267 4C9.43629 3.81665 9.51434 3.62575 9.576 3.42933L9.70933 3.02933C9.83067 2.66533 9.85867 2.592 9.88667 2.53867C9.95865 2.40001 10.0621 2.28015 10.1888 2.18869C10.3154 2.09723 10.4617 2.03672 10.616 2.012C10.7898 1.99732 10.9644 1.99331 11.1387 2H15.5253C15.9093 2 15.9893 2.00267 16.048 2.01333C16.2021 2.03791 16.3484 2.09822 16.475 2.18944C16.6017 2.28066 16.7052 2.40026 16.7773 2.53867C16.8053 2.592 16.8333 2.66533 16.9547 3.03067L17.088 3.43067L17.14 3.58C17.192 3.72667 17.2533 3.86533 17.3213 4H9.34267Z" fill="white"/>
        </svg>
        <svg className="w-4" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.99823 4.93356C4.98054 4.66887 4.85844 4.42205 4.65878 4.24739C4.45911 4.07273 4.19825 3.98454 3.93356 4.00223C3.66887 4.01991 3.42205 4.14201 3.24739 4.34167C3.07273 4.54134 2.98454 4.80221 3.00223 5.06689L3.62089 14.3362C3.73423 16.0456 3.82623 17.4269 4.04223 18.5122C4.26756 19.6389 4.64889 20.5802 5.43823 21.3176C6.22623 22.0562 7.19156 22.3749 8.33156 22.5229C9.42756 22.6669 10.8116 22.6669 12.5262 22.6669H13.6982C15.4116 22.6669 16.7969 22.6669 17.8929 22.5229C19.0316 22.3749 19.9969 22.0562 20.7862 21.3176C21.5742 20.5802 21.9556 19.6376 22.1809 18.5122C22.3969 17.4282 22.4876 16.0456 22.6022 14.3362L23.2209 5.06689C23.2386 4.80221 23.1504 4.54134 22.9757 4.34167C22.8011 4.14201 22.5542 4.01991 22.2896 4.00223C22.0249 3.98454 21.764 4.07273 21.5643 4.24739C21.3647 4.42205 21.2426 4.66887 21.2249 4.93356L20.6116 14.1336C20.4916 15.9296 20.4062 17.1802 20.2196 18.1202C20.0369 19.0336 19.7836 19.5162 19.4196 19.8576C19.0542 20.1989 18.5556 20.4202 17.6329 20.5402C16.6822 20.6642 15.4289 20.6669 13.6276 20.6669H12.5956C10.7956 20.6669 9.54223 20.6642 8.59023 20.5402C7.66756 20.4202 7.16889 20.1989 6.80356 19.8576C6.43956 19.5162 6.18623 19.0336 6.00356 18.1216C5.81689 17.1802 5.73156 15.9296 5.61156 14.1322L4.99823 4.93356Z" fill="white"/>
            <path d="M9.67823 7.33889C9.94201 7.31246 10.2055 7.39185 10.4108 7.55961C10.616 7.72738 10.7463 7.96979 10.7729 8.23356L11.4396 14.9002C11.4591 15.1603 11.3762 15.4178 11.2086 15.6176C11.041 15.8175 10.8019 15.944 10.5424 15.9701C10.2829 15.9962 10.0234 15.9198 9.81937 15.7573C9.61533 15.5948 9.48287 15.359 9.45023 15.1002L8.78356 8.43356C8.75712 8.16977 8.83652 7.90629 9.00428 7.70102C9.17205 7.49575 9.41446 7.36549 9.67823 7.33889ZM16.5449 7.33889C16.8084 7.3655 17.0506 7.49557 17.2183 7.70054C17.3861 7.90552 17.4656 8.16866 17.4396 8.43223L16.7729 15.0989C16.7398 15.3572 16.6073 15.5924 16.4035 15.7545C16.1997 15.9166 15.9407 15.9929 15.6816 15.967C15.4225 15.9411 15.1837 15.8152 15.016 15.616C14.8483 15.4167 14.7649 15.16 14.7836 14.9002L15.4502 8.23356C15.4768 7.97005 15.6069 7.72785 15.8119 7.56012C16.0168 7.39239 16.2813 7.31283 16.5449 7.33889Z" fill="white"/>
        </svg>
    </Button>
);
}