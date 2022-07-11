module.exports = [
	{
		name: 'join',
		description: 'Haz que entre a tu canal de voz'
	},
	{
		name: 'leave',
		description: 'Haz que abandone tu canal de voz'
	},
	{
		name: 'play',
		description: 'Añade una canción a la cola',
		options: [
			{
				name: 'canción',
				type: 'STRING',
				description: 'La canción que quieras añadir',
				required: true
			}
		]
	},
	{
		name: 'search',
		description: 'Busca canciones para seleccionar entre 10 resultados',
		options: [
			{
				name: 'búsqueda',
				type: 'STRING',
				description: 'La canción que quieras buscar',
				required: true
			}
		]
	}
];
