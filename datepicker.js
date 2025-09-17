/**
 * PaperCSS Date Picker
 * Simple, accessible date picker component
 */

class PaperDatePicker {
  constructor(inputElement, options = {}) {
    this.input = typeof inputElement === 'string' ? document.querySelector(inputElement) : inputElement;
    this.calendar = this.input.nextElementSibling;
    
    // Default options
    this.options = {
      format: 'DD/MM/YYYY',
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      firstDayOfWeek: 1, // 0 = Sunday, 1 = Monday
      minDate: null,
      maxDate: null,
      disabledDates: [],
      onSelect: null,
      ...options
    };
    
    this.currentDate = new Date();
    this.selectedDate = null;
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (!this.input || !this.calendar) {
      console.error('PaperDatePicker: Invalid input or calendar element');
      return;
    }
    
    this.setupElements();
    this.bindEvents();
    this.render();
  }
  
  setupElements() {
    // Make input readonly
    this.input.readOnly = true;
    this.input.style.cursor = 'pointer';
    
    // Find calendar elements
    this.monthDisplay = this.calendar.querySelector('.date-picker-month');
    this.prevButton = this.calendar.querySelector('.date-picker-nav[data-action="prev"]') || 
                      this.calendar.querySelector('.date-picker-nav:first-child');
    this.nextButton = this.calendar.querySelector('.date-picker-nav[data-action="next"]') || 
                      this.calendar.querySelector('.date-picker-nav:last-child');
    this.grid = this.calendar.querySelector('.date-picker-grid');
  }
  
  bindEvents() {
    // Input click
    this.input.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
    
    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.previousMonth();
      });
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextMonth();
      });
    }
    
    // Day clicks
    this.calendar.addEventListener('click', (e) => {
      if (e.target.classList.contains('date-picker-day') && 
          !e.target.classList.contains('other-month') &&
          !e.target.hasAttribute('disabled')) {
        this.selectDate(parseInt(e.target.textContent));
      }
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.calendar.contains(e.target)) {
        this.close();
      }
    });
    
    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape') {
        this.close();
      }
    });
  }
  
  render() {
    this.renderMonth();
    this.renderDays();
  }
  
  renderMonth() {
    if (this.monthDisplay) {
      const monthName = this.options.monthNames[this.currentDate.getMonth()];
      const year = this.currentDate.getFullYear();
      this.monthDisplay.textContent = `${monthName} ${year}`;
    }
  }
  
  renderDays() {
    if (!this.grid) return;
    
    // Clear existing days (keep weekday headers)
    const days = this.grid.querySelectorAll('.date-picker-day');
    days.forEach(day => day.remove());
    
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate starting point (considering first day of week)
    let startDate = new Date(firstDay);
    const dayOfWeek = (firstDay.getDay() + 7 - this.options.firstDayOfWeek) % 7;
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // Generate 42 days (6 weeks)
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const dayElement = document.createElement('div');
      dayElement.className = 'date-picker-day';
      dayElement.textContent = currentDay.getDate();
      
      // Add classes
      if (currentDay.getMonth() !== month) {
        dayElement.classList.add('other-month');
      }
      
      if (this.isSameDay(currentDay, today)) {
        dayElement.classList.add('today');
      }
      
      if (this.selectedDate && this.isSameDay(currentDay, this.selectedDate)) {
        dayElement.classList.add('selected');
      }
      
      // Check if disabled
      if (this.isDisabled(currentDay)) {
        dayElement.setAttribute('disabled', 'true');
        dayElement.style.opacity = '0.3';
        dayElement.style.cursor = 'not-allowed';
      }
      
      this.grid.appendChild(dayElement);
    }
  }
  
  selectDate(day) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.selectedDate = new Date(year, month, day);
    
    // Update input
    this.input.value = this.formatDate(this.selectedDate);
    
    // Update display
    this.render();
    
    // Trigger change event
    const event = new CustomEvent('change', { detail: { date: this.selectedDate } });
    this.input.dispatchEvent(event);
    
    // Call callback
    if (this.options.onSelect) {
      this.options.onSelect(this.selectedDate);
    }
    
    // Close calendar
    this.close();
  }
  
  formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return this.options.format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  }
  
  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  }
  
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  }
  
  open() {
    if (!this.isOpen) {
      this.calendar.classList.add('open');
      this.isOpen = true;
      this.render(); // Refresh display
    }
  }
  
  close() {
    if (this.isOpen) {
      this.calendar.classList.remove('open');
      this.isOpen = false;
    }
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
  
  isDisabled(date) {
    // Check min/max dates
    if (this.options.minDate && date < this.options.minDate) return true;
    if (this.options.maxDate && date > this.options.maxDate) return true;
    
    // Check disabled dates array
    if (this.options.disabledDates.some(disabled => this.isSameDay(date, disabled))) {
      return true;
    }
    
    return false;
  }
  
  // Public methods
  setDate(date) {
    this.selectedDate = new Date(date);
    this.currentDate = new Date(date);
    this.input.value = this.formatDate(this.selectedDate);
    this.render();
  }
  
  getDate() {
    return this.selectedDate;
  }
  
  destroy() {
    // Remove event listeners and cleanup
    this.close();
  }
}

// Auto-initialize date pickers
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all date pickers with default settings
  const datePickers = document.querySelectorAll('.date-picker');
  
  datePickers.forEach(picker => {
    const input = picker.querySelector('.date-picker-input');
    if (input && !input.datePicker) {
      // Check for custom options in data attributes
      const options = {};
      
      if (picker.dataset.format) {
        options.format = picker.dataset.format;
      }
      
      if (picker.dataset.minDate) {
        options.minDate = new Date(picker.dataset.minDate);
      }
      
      if (picker.dataset.maxDate) {
        options.maxDate = new Date(picker.dataset.maxDate);
      }
      
      // Polish/English month names based on lang
      if (document.documentElement.lang === 'pl') {
        options.monthNames = [
          'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
          'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ];
        options.weekdays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
      }
      
      input.datePicker = new PaperDatePicker(input, options);
    }
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PaperDatePicker;
}

// Global assignment
window.PaperDatePicker = PaperDatePicker;