export function CardA() {
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90b0NvbnRlbnx8fHx8fHx8MA%3D%3D";

  return (
    <div
      className="card-shadow relative h-96 overflow-hidden rounded-[var(--radius-lg)] bg-cover bg-center p-0"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(transparent 0%, var(--color-brand-800) 100%)",
        }}
      >
        <div className="flex h-full">
          <div className="mb-2 mt-auto rounded-[var(--radius-lg)] p-6 font-heading text-4xl font-semibold leading-none tracking-tight text-[var(--color-brand-50)] drop-shadow-sm">
            Create
            <br />
            <span className="text-[var(--color-brand-200)]">
              custom themes
              <br />
            </span>
            <span className="text-[var(--color-brand-50)]">in seconds.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardB() {
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90b0NvbnRlbnx8fHx8fHx8MA%3D%3D";

  return (
    <div
      className="card-shadow relative h-96 overflow-hidden rounded-[var(--radius-lg)] bg-cover bg-bottom p-2"
      style={{ backgroundColor: "var(--color-brand-200)" }}
    >
      <div className="absolute inset-0">
        <div
          className="absolute z-0 rounded-full"
          style={{
            width: "26rem",
            height: "26rem",
            top: "2rem",
            right: "6rem",
            backgroundPosition: "25% -83%",
            backgroundSize: "90%",
            transform: "translate(50%, -50%)",
            backgroundImage: `url('${backgroundImageUrl}')`,
          }}
        ></div>
        <div
          className="absolute rounded-full"
          style={{
            width: "22rem",
            height: "22rem",
            top: "2rem",
            right: "6rem",
            border: "25px solid var(--color-brand-200)",
            transform: "translate(50%, -50%)",
          }}
        ></div>
        <div
          className="absolute rounded-full"
          style={{
            width: "14rem",
            height: "14rem",
            top: "2rem",
            right: "6rem",
            border: "25px solid var(--color-brand-200)",
            transform: "translate(50%, -50%)",
          }}
        ></div>
      </div>
      <div className="flex h-full">
        <div
          className="mb-2 mt-auto rounded-2xl p-6 font-heading text-4xl font-semibold leading-none tracking-tight drop-shadow-sm "
          style={{ color: "var(--color-brand-950)" }}
        >
          Create
          <br />
          <span style={{ color: "var(--color-brand-700)" }}>custom themes</span>
          <br />
          in seconds.
        </div>
      </div>
    </div>
  );
}
export function CardC() {
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90b0NvbnRlbnx8fHx8fHx8MA%3D%3D";

  return (
    <div
      className="card-shadow relative h-96 overflow-hidden rounded-[var(--radius-lg)] bg-cover bg-center p-2"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      <div className="flex h-full">
        <div
          className="mb-2 mt-auto w-full rounded-[var(--radius-lg)] border bg-brand bg-opacity-80 p-4 leading-none opacity-80 backdrop-blur-sm backdrop-filter"
          style={{
            borderColor: "var(--color-brand-600)",
          }}
        >
          <div className="font-heading text-4xl font-semibold tracking-tight text-white">
            Create
            <br />
            custom themes
            <br />
            in seconds.
          </div>
        </div>
      </div>
    </div>
  );
}
