export function CardA() {
    const backgroundImageUrl = "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90b0NvbnRlbnx8fHx8fHx8MA%3D%3D";

    return (
        <div className="card-shadow rounded-[var(--radius-lg)] p-0 bg-cover bg-center h-96 relative overflow-hidden"
             style={{ backgroundImage: `url('${backgroundImageUrl}')` }}>
          <div className="absolute inset-0" 
               style={{ backgroundImage: 'linear-gradient(transparent 0%, var(--color-brand-800) 100%)' }}>
            <div className="h-full flex">
              <div className="leading-none p-6 rounded-[var(--radius-lg)] mt-auto mb-2 text-4xl font-heading font-semibold drop-shadow-sm tracking-tight text-[var(--color-brand-50)]">
                Create
                <br />
                <span className="text-[var(--color-brand-200)]">
                  color scales
                  <br />
                </span>
                <span className="text-[var(--color-brand-50)]">
                  in seconds.
                </span>
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
    <div className="card-shadow rounded-[var(--radius-lg)] p-2 bg-cover bg-bottom h-96 relative overflow-hidden"
         style={{ backgroundColor: "var(--color-brand-200)" }}>
      <div className="absolute inset-0">
        <div className="absolute rounded-full z-0"
             style={{
               width: '26rem', height: '26rem', top: '2rem', right: '6rem',
               backgroundPosition: '25% -83%', backgroundSize: '90%', transform: 'translate(50%, -50%)',
               backgroundImage: `url('${backgroundImageUrl}')`
             }}>
        </div>
        <div className="absolute rounded-full"
             style={{
               width: '22rem', height: '22rem', top: '2rem', right: '6rem',
               border: '25px solid var(--color-brand-200)', transform: 'translate(50%, -50%)'
             }}>
        </div>
        <div className="absolute rounded-full"
             style={{
               width: '14rem', height: '14rem', top: '2rem', right: '6rem',
               border: '25px solid var(--color-brand-200)', transform: 'translate(50%, -50%)'
             }}>
        </div>
      </div>
      <div className="h-full flex">
        <div className="leading-none p-6 rounded-2xl mt-auto mb-2 text-4xl font-semibold font-heading drop-shadow-sm tracking-tight "
             style={{ color: 'var(--color-brand-950)' }}>
          Create
          <br />
          <span style={{ color: 'var(--color-brand-700)' }}>
            color scales
          </span>
          <br />
          in seconds.
        </div>
      </div>
    </div>
  );
};
export function CardC() {

  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90b0NvbnRlbnx8fHx8fHx8MA%3D%3D";
  
    return (
        <div className="card-shadow rounded-[var(--radius-lg)] p-2 bg-cover bg-center h-96 relative overflow-hidden"
             style={{ backgroundImage: `url('${backgroundImageUrl}')` }}>
          <div className="h-full flex">
            <div className="leading-none p-4 rounded-[var(--radius-lg)] mt-auto mb-2 border w-full bg-opacity-80 bg-brand backdrop-filter backdrop-blur-sm opacity-80"
                 style={{ 
                   borderColor: 'var(--color-brand-600)' 
                 }}>
              <div className="text-4xl font-semibold font-heading tracking-tight text-white">
              Create
              <br />
              color scales
              <br />
              in seconds.
              </div>
            </div>
          </div>
        </div>
      );
};


