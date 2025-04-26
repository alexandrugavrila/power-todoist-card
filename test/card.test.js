import { html, render } from 'lit-html';
import '../powertodoist-card.js'; // adjust path if needed

test('renders with config', async () => {
  const card = document.createElement('powertodoist-card');
  card.setConfig({ entity: 'sensor.mock', line_size: 18 });
  card.hass = {
    user: { name: 'Alexandru' },
    states: {
      'sensor.mock': {
        state: '123',
        attributes: {
          items: [{ id: 1, content: 'Test Task', labels: [] }],
          project: { name: 'Test' },
          sections: [],
          project_notes: []
        }
      },
      'sensor.label_colors': {
        attributes: {
          label_colors: []
        }
      }
    },
    callService: () => Promise.resolve()
  };
  document.body.append(card);
  await card.updateComplete;

  expect(card.shadowRoot.textContent).toContain('Test Task');
});
