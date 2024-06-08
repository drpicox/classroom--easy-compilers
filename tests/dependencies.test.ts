import {test, expect} from 'vitest';

type Dependency = {
    name: string;
    dependencies: string[];
};

type Dependencies = {
    [name: string]: Dependency;
};

class DependenciesBuilder {
    #dependencies: Dependencies = {};

    add(name: string, dep: string) {
        if (!this.#dependencies[name]) {
            this.#dependencies[name] = {name, dependencies: []};
        }
        if (!this.#dependencies[dep]) {
            this.#dependencies[dep] = {name: dep, dependencies: []};
        }
        this.#dependencies[name].dependencies.push(dep);

        return this;
    }

    build(): Dependencies {
        return this.#dependencies;
    }
}

test('dependency creation tool', () => {
    const builder = new DependenciesBuilder();
    builder.add('A', 'B').add('B', 'C').add('C', 'D');
    builder.add('A', 'C');

    expect(builder.build()).toEqual({
        A: {name: 'A', dependencies: ['B', 'C']},
        B: {name: 'B', dependencies: ['C']},
        C: {name: 'C', dependencies: ['D']},
        D: {name: 'D', dependencies: []},
    });
});

function compileLine(line: string, dependencyGraph: DependenciesBuilder) {
    let [name, ...dependencies] = line.split(/->/).map((s) => s.trim());
    for (const dep of dependencies) {
        dependencyGraph.add(name, dep);
        name = dep;
    }
}

function compileGraph(graph: string): Dependencies {
    const dependenciesBuilder = new DependenciesBuilder();
    const lines = graph.trim().split('\n');
    for (const line of lines) {
        compileLine(line, dependenciesBuilder);
    }
    return dependenciesBuilder.build();
}

test('dependency compiler', () => {
    const graph = `
    A -> B -> C -> D
    A      -> C
    `;

    const dependencies = compileGraph(graph);
    expect(dependencies).toEqual({
        A: {name: 'A', dependencies: ['B', 'C']},
        B: {name: 'B', dependencies: ['C']},
        C: {name: 'C', dependencies: ['D']},
        D: {name: 'D', dependencies: []},
    });
});
