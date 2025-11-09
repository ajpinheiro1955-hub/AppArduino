import React, { useState, useCallback } from 'react';
import { generateArduinoProject } from './services/geminiService.ts';
import type { ArduinoProject } from './types.ts';
import { ProjectOutput } from './components/ProjectOutput.tsx';
import { LogoIcon, SparklesIcon, AlertIcon } from './components/Icons.tsx';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [project, setProject] = useState<ArduinoProject | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Por favor, descreva o projeto que você deseja criar.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setProject(null);
        try {
            const result = await generateArduinoProject(prompt);
            setProject(result);
        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro ao gerar o projeto. A API pode estar indisponível ou a resposta foi malformada. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);
    
    const handleExampleClick = () => {
        setPrompt("Um semáforo para pedestres com um botão. Quando o botão é pressionado, a luz verde do carro fica amarela por 3 segundos, depois vermelha. Em seguida, a luz verde do pedestre acende por 10 segundos, pisca por 3 segundos e apaga. Finalmente, a luz verde do carro acende novamente.");
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans">
            <main className="container mx-auto px-4 py-8 md:py-12">
                <header className="text-center mb-10">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <LogoIcon className="h-12 w-12 text-cyan-400"/>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight">
                            Gerador de Projetos Arduino
                        </h1>
                    </div>
                    <p className="text-lg text-slate-400">
                        Descreva sua ideia e deixe a IA criar o código, a lista de componentes e o diagrama do circuito.
                    </p>
                </header>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
                        <label htmlFor="project-description" className="block text-lg font-medium text-cyan-300 mb-2">
                            Qual projeto você quer construir?
                        </label>
                        <textarea
                            id="project-description"
                            rows={5}
                            className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none"
                            placeholder="Ex: um termômetro com display LCD que mostra a temperatura e a umidade..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                        />
                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button 
                                type="button"
                                onClick={handleExampleClick}
                                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                Usar um exemplo
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !prompt.trim()}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2"/>
                                {isLoading ? 'Gerando...' : 'Gerar Projeto'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
                           <AlertIcon className="w-5 h-5" />
                           <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="mt-12">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center text-center text-slate-400">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                            <p className="text-lg font-medium">A IA está montando seu projeto...</p>
                            <p className="text-sm">Isso pode levar alguns segundos.</p>
                        </div>
                    )}

                    {project && <ProjectOutput project={project} />}
                </div>
            </main>
        </div>
    );
};

export default App;