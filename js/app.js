/* ============================================================
   ProtoCol — Core Generator Engine
   Handles all 8 schema types: generation, validation, preview
   ============================================================ */

(function () {
  'use strict';

  // --- Utility Helpers ---
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  // --- Toast Notification ---
  function showToast(msg, duration) {
    duration = duration || 2500;
    let toast = $('#toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { toast.classList.remove('show'); }, duration);
  }

  // --- Copy to Clipboard ---
  window.copySchema = function () {
    var pre = $('#schemaOutput');
    if (!pre) return;
    var text = pre.textContent;
    if (!text || text.trim() === '{}' || text.trim() === '') {
      showToast('Fill in some fields first!');
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      var btn = $('#copyBtn');
      if (btn) {
        var orig = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(function () { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
      }
      showToast('Schema copied to clipboard!');
    }).catch(function () {
      // Fallback
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Schema copied!');
    });
  };

  // --- JSON Syntax Highlighting ---
  function highlightJSON(json) {
    if (typeof json !== 'string') json = JSON.stringify(json, null, 2);
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, function (match) {
        var cls = 'json-string';
        if (/:$/.test(match)) {
          cls = 'json-key';
          // Remove trailing colon for wrapping, add it back
          return '<span class="' + cls + '">' + match.slice(0, -1) + '</span>:';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      })
      .replace(/\b(true|false)\b/g, '<span class="json-bool">$1</span>')
      .replace(/\b(null)\b/g, '<span class="json-null">$1</span>')
      .replace(/\b(-?\d+\.?\d*([eE][+-]?\d+)?)\b/g, '<span class="json-number">$1</span>')
      .replace(/([[\]{}])/g, '<span class="json-bracket">$1</span>');
  }

  // --- Render JSON to preview area ---
  function renderSchema(schema) {
    var pre = $('#schemaOutput');
    if (!pre) return;
    var json = JSON.stringify(schema, null, 2);
    pre.innerHTML = highlightJSON(json);
  }

  // --- Validation Helpers ---
  function isValidURL(str) {
    if (!str) return true; // empty is ok for optional
    try { new URL(str); return true; } catch (e) { return false; }
  }

  function isValidDate(str) {
    if (!str) return true;
    return !isNaN(Date.parse(str));
  }

  function markField(input, valid) {
    if (valid) {
      input.classList.remove('invalid');
    } else {
      input.classList.add('invalid');
    }
    return valid;
  }

  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function getValDef(id, def) {
    var v = getVal(id);
    return v || def || '';
  }

  // --- Nav Toggle ---
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = $('#navToggle');
    var links = $('#navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        links.classList.toggle('open');
      });
    }

    // Auto-init generator if present
    var genType = document.body.getAttribute('data-generator');
    if (genType) {
      initGenerator(genType);
    }
  });

  // --- Generator Initialization ---
  function initGenerator(type) {
    var form = $('#generatorForm');
    if (!form) return;

    // Listen for input changes
    form.addEventListener('input', function () {
      generateSchema(type);
    });
    form.addEventListener('change', function () {
      generateSchema(type);
    });

    // Initial generation
    setTimeout(function () { generateSchema(type); }, 100);
  }

  // --- Schema Generation Router ---
  function generateSchema(type) {
    var schema;
    switch (type) {
      case 'faq': schema = generateFAQ(); break;
      case 'local-business': schema = generateLocalBusiness(); break;
      case 'article': schema = generateArticle(); break;
      case 'product': schema = generateProduct(); break;
      case 'event': schema = generateEvent(); break;
      case 'howto': schema = generateHowTo(); break;
      case 'organization': schema = generateOrganization(); break;
      case 'recipe': schema = generateRecipe(); break;
      default: return;
    }
    renderSchema(schema);
    updateRichPreview(type, schema);
  }

  // =============================================
  // FAQ SCHEMA
  // =============================================
  function generateFAQ() {
    var items = $$('.faq-item');
    var mainEntity = [];
    items.forEach(function (item) {
      var q = item.querySelector('.faq-question');
      var a = item.querySelector('.faq-answer');
      if (q && a && (q.value.trim() || a.value.trim())) {
        mainEntity.push({
          "@type": "Question",
          "name": q.value.trim(),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": a.value.trim()
          }
        });
      }
    });

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": mainEntity
    };
  }

  window.addFAQItem = function () {
    var container = $('#faqItems');
    if (!container) return;
    var count = container.children.length + 1;
    var div = document.createElement('div');
    div.className = 'dynamic-item faq-item';
    div.innerHTML =
      '<div class="dynamic-item-header">' +
        '<span class="dynamic-item-number">Question ' + count + '</span>' +
        '<button type="button" class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">✕ Remove</button>' +
      '</div>' +
      '<div class="form-group">' +
        '<label>Question <span class="required">*</span></label>' +
        '<input type="text" class="faq-question" placeholder="e.g. What is your return policy?">' +
      '</div>' +
      '<div class="form-group">' +
        '<label>Answer <span class="required">*</span></label>' +
        '<textarea class="faq-answer" rows="3" placeholder="e.g. We offer a 30-day money back guarantee..."></textarea>' +
        '<span class="form-hint">HTML is allowed in the answer</span>' +
      '</div>';
    container.appendChild(div);
    // Trigger regeneration
    div.querySelector('.faq-question').addEventListener('input', function () { generateSchema('faq'); });
    div.querySelector('.faq-answer').addEventListener('input', function () { generateSchema('faq'); });
  };

  // =============================================
  // LOCAL BUSINESS SCHEMA
  // =============================================
  function generateLocalBusiness() {
    var schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": getVal('bizName'),
      "image": getVal('bizImage'),
      "@id": getVal('bizId'),
      "url": getVal('bizUrl'),
      "telephone": getVal('bizPhone'),
      "priceRange": getVal('bizPriceRange'),
      "address": {
        "@type": "PostalAddress",
        "streetAddress": getVal('bizStreet'),
        "addressLocality": getVal('bizCity'),
        "addressRegion": getVal('bizState'),
        "postalCode": getVal('bizZip'),
        "addressCountry": getVal('bizCountry')
      }
    };

    var lat = getVal('bizLat');
    var lng = getVal('bizLng');
    if (lat && lng) {
      schema.geo = {
        "@type": "GeoCoordinates",
        "latitude": parseFloat(lat),
        "longitude": parseFloat(lng)
      };
    }

    // Opening hours
    var hoursItems = $$('.hours-item');
    var openingHours = [];
    hoursItems.forEach(function (item) {
      var day = item.querySelector('.hours-day');
      var open = item.querySelector('.hours-open');
      var close = item.querySelector('.hours-close');
      if (day && open && close && day.value && open.value && close.value) {
        openingHours.push({
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": day.value,
          "opens": open.value,
          "closes": close.value
        });
      }
    });
    if (openingHours.length > 0) {
      schema.openingHoursSpecification = openingHours;
    }

    return cleanSchema(schema);
  }

  window.addHoursItem = function () {
    var container = $('#hoursItems');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'dynamic-item hours-item';
    div.innerHTML =
      '<div class="dynamic-item-header">' +
        '<span class="dynamic-item-number">Opening Hours</span>' +
        '<button type="button" class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">✕ Remove</button>' +
      '</div>' +
      '<div class="form-row-3">' +
        '<div class="form-group">' +
          '<label>Day</label>' +
          '<select class="hours-day">' +
            '<option value="">Select day</option>' +
            '<option value="Monday">Monday</option>' +
            '<option value="Tuesday">Tuesday</option>' +
            '<option value="Wednesday">Wednesday</option>' +
            '<option value="Thursday">Thursday</option>' +
            '<option value="Friday">Friday</option>' +
            '<option value="Saturday">Saturday</option>' +
            '<option value="Sunday">Sunday</option>' +
          '</select>' +
        '</div>' +
        '<div class="form-group">' +
          '<label>Opens</label>' +
          '<input type="time" class="hours-open">' +
        '</div>' +
        '<div class="form-group">' +
          '<label>Closes</label>' +
          '<input type="time" class="hours-close">' +
        '</div>' +
      '</div>';
    container.appendChild(div);
    bindFormEvents(div);
  };

  // =============================================
  // ARTICLE SCHEMA
  // =============================================
  function generateArticle() {
    var schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": getVal('artHeadline'),
      "image": getVal('artImage'),
      "datePublished": getVal('artDatePub'),
      "dateModified": getVal('artDateMod'),
      "author": {
        "@type": "Person",
        "name": getVal('artAuthorName'),
        "url": getVal('artAuthorUrl')
      },
      "publisher": {
        "@type": "Organization",
        "name": getVal('artPubName'),
        "logo": {
          "@type": "ImageObject",
          "url": getVal('artPubLogo')
        }
      },
      "description": getVal('artDesc')
    };
    return cleanSchema(schema);
  }

  // =============================================
  // PRODUCT SCHEMA
  // =============================================
  function generateProduct() {
    var schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": getVal('prodName'),
      "image": getVal('prodImage'),
      "description": getVal('prodDesc'),
      "sku": getVal('prodSku'),
      "brand": {
        "@type": "Brand",
        "name": getVal('prodBrand')
      },
      "offers": {
        "@type": "Offer",
        "price": getVal('prodPrice'),
        "priceCurrency": getVal('prodCurrency') || 'USD',
        "availability": getVal('prodAvail') || 'https://schema.org/InStock',
        "url": getVal('prodOfferUrl'),
        "priceValidUntil": getVal('prodValidUntil')
      }
    };

    var rating = getVal('prodRating');
    var reviewer = getVal('prodReviewer');
    if (rating) {
      schema.review = {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": rating,
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": reviewer || "Anonymous"
        }
      };
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "reviewCount": "1"
      };
    }

    return cleanSchema(schema);
  }

  // =============================================
  // EVENT SCHEMA
  // =============================================
  function generateEvent() {
    var schema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": getVal('evtName'),
      "startDate": getVal('evtStart'),
      "endDate": getVal('evtEnd'),
      "location": {
        "@type": "Place",
        "name": getVal('evtLocName'),
        "address": {
          "@type": "PostalAddress",
          "streetAddress": getVal('evtStreet'),
          "addressLocality": getVal('evtCity'),
          "addressRegion": getVal('evtState'),
          "postalCode": getVal('evtZip'),
          "addressCountry": getVal('evtCountry')
        }
      },
      "description": getVal('evtDesc'),
      "image": getVal('evtImage'),
      "url": getVal('evtUrl')
    };

    var price = getVal('evtPrice');
    if (price) {
      schema.offers = {
        "@type": "Offer",
        "price": price,
        "priceCurrency": getVal('evtCurrency') || 'USD',
        "availability": getVal('evtAvail') || 'https://schema.org/InStock',
        "url": getVal('evtOfferUrl')
      };
    }

    return cleanSchema(schema);
  }

  // =============================================
  // HOW-TO SCHEMA
  // =============================================
  function generateHowTo() {
    var schema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": getVal('htTitle'),
      "description": getVal('htDesc'),
      "totalTime": getVal('htTime'),
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": getVal('htCurrency') || 'USD',
        "value": getVal('htCost')
      }
    };

    // Tools
    var tools = $$('.ht-tool');
    var toolList = [];
    tools.forEach(function (t) {
      if (t.value.trim()) {
        toolList.push({ "@type": "HowToTool", "name": t.value.trim() });
      }
    });
    if (toolList.length) schema.tool = toolList;

    // Supplies
    var supplies = $$('.ht-supply');
    var supplyList = [];
    supplies.forEach(function (s) {
      if (s.value.trim()) {
        supplyList.push({ "@type": "HowToSupply", "name": s.value.trim() });
      }
    });
    if (supplyList.length) schema.supply = supplyList;

    // Steps
    var stepItems = $$('.ht-step-item');
    var steps = [];
    stepItems.forEach(function (item, i) {
      var name = item.querySelector('.ht-step-name');
      var text = item.querySelector('.ht-step-text');
      var image = item.querySelector('.ht-step-image');
      var step = {
        "@type": "HowToStep",
        "name": name ? name.value.trim() : '',
        "text": text ? text.value.trim() : '',
        "url": window.location.href + '#step' + (i + 1)
      };
      if (image && image.value.trim()) step.image = image.value.trim();
      if (step.name || step.text) steps.push(step);
    });
    schema.step = steps;

    return cleanSchema(schema);
  }

  window.addHowToStep = function () {
    var container = $('#htSteps');
    if (!container) return;
    var count = container.children.length + 1;
    var div = document.createElement('div');
    div.className = 'dynamic-item ht-step-item';
    div.innerHTML =
      '<div class="dynamic-item-header">' +
        '<span class="dynamic-item-number">Step ' + count + '</span>' +
        '<button type="button" class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">✕ Remove</button>' +
      '</div>' +
      '<div class="form-group">' +
        '<label>Step Name <span class="required">*</span></label>' +
        '<input type="text" class="ht-step-name" placeholder="e.g. Preheat the oven">' +
      '</div>' +
      '<div class="form-group">' +
        '<label>Step Text <span class="required">*</span></label>' +
        '<textarea class="ht-step-text" rows="2" placeholder="Detailed description of this step..."></textarea>' +
      '</div>' +
      '<div class="form-group">' +
        '<label>Step Image URL</label>' +
        '<input type="url" class="ht-step-image" placeholder="https://example.com/step-image.jpg">' +
      '</div>';
    container.appendChild(div);
    bindFormEvents(div);
  };

  window.addTool = function () {
    var container = $('#htTools');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'multi-input-row';
    div.innerHTML =
      '<input type="text" class="ht-tool" placeholder="e.g. Screwdriver">' +
      '<button type="button" class="btn btn-danger btn-icon btn-sm" onclick="this.parentElement.remove(); generateSchema(\'howto\')">✕</button>';
    container.appendChild(div);
    bindFormEvents(div);
  };

  window.addSupply = function () {
    var container = $('#htSupplies');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'multi-input-row';
    div.innerHTML =
      '<input type="text" class="ht-supply" placeholder="e.g. Wood screws">' +
      '<button type="button" class="btn btn-danger btn-icon btn-sm" onclick="this.parentElement.remove(); generateSchema(\'howto\')">✕</button>';
    container.appendChild(div);
    bindFormEvents(div);
  };

  // =============================================
  // ORGANIZATION SCHEMA
  // =============================================
  function generateOrganization() {
    var schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": getVal('orgName'),
      "url": getVal('orgUrl'),
      "logo": getVal('orgLogo'),
      "description": getVal('orgDesc'),
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": getVal('orgContactType') || 'customer service',
        "telephone": getVal('orgPhone'),
        "email": getVal('orgEmail'),
        "areaServed": getVal('orgArea')
      }
    };

    // Social profiles
    var socials = $$('.org-social');
    var sameAs = [];
    socials.forEach(function (s) {
      if (s.value.trim()) sameAs.push(s.value.trim());
    });
    if (sameAs.length) schema.sameAs = sameAs;

    return cleanSchema(schema);
  }

  window.addSocialProfile = function () {
    var container = $('#orgSocials');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'multi-input-row';
    div.innerHTML =
      '<input type="url" class="org-social" placeholder="https://twitter.com/yourcompany">' +
      '<button type="button" class="btn btn-danger btn-icon btn-sm" onclick="this.parentElement.remove(); generateSchema(\'organization\')">✕</button>';
    container.appendChild(div);
    bindFormEvents(div);
  };

  // =============================================
  // RECIPE SCHEMA
  // =============================================
  function generateRecipe() {
    var schema = {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": getVal('recName'),
      "image": getVal('recImage'),
      "author": {
        "@type": "Person",
        "name": getVal('recAuthor')
      },
      "datePublished": getVal('recDate'),
      "description": getVal('recDesc'),
      "prepTime": getVal('recPrep'),
      "cookTime": getVal('recCook'),
      "totalTime": getVal('recTotal'),
      "recipeYield": getVal('recYield')
    };

    // Ingredients
    var ingredients = $$('.rec-ingredient');
    var ingList = [];
    ingredients.forEach(function (ing) {
      if (ing.value.trim()) ingList.push(ing.value.trim());
    });
    if (ingList.length) schema.recipeIngredient = ingList;

    // Instructions
    var instructions = $$('.rec-instruction-item');
    var instrList = [];
    instructions.forEach(function (item) {
      var text = item.querySelector('.rec-instruction');
      if (text && text.value.trim()) {
        instrList.push({
          "@type": "HowToStep",
          "text": text.value.trim()
        });
      }
    });
    if (instrList.length) schema.recipeInstructions = instrList;

    // Nutrition
    var cal = getVal('recCalories');
    if (cal) {
      schema.nutrition = {
        "@type": "NutritionInformation",
        "calories": cal + ' calories'
      };
    }

    return cleanSchema(schema);
  }

  window.addIngredient = function () {
    var container = $('#recIngredients');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'multi-input-row';
    div.innerHTML =
      '<input type="text" class="rec-ingredient" placeholder="e.g. 2 cups flour">' +
      '<button type="button" class="btn btn-danger btn-icon btn-sm" onclick="this.parentElement.remove(); generateSchema(\'recipe\')">✕</button>';
    container.appendChild(div);
    bindFormEvents(div);
  };

  window.addInstruction = function () {
    var container = $('#recInstructions');
    if (!container) return;
    var count = container.children.length + 1;
    var div = document.createElement('div');
    div.className = 'dynamic-item rec-instruction-item';
    div.innerHTML =
      '<div class="dynamic-item-header">' +
        '<span class="dynamic-item-number">Step ' + count + '</span>' +
        '<button type="button" class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">✕ Remove</button>' +
      '</div>' +
      '<div class="form-group">' +
        '<label>Instruction</label>' +
        '<textarea class="rec-instruction" rows="2" placeholder="Describe this step..."></textarea>' +
      '</div>';
    container.appendChild(div);
    bindFormEvents(div);
  };

  // =============================================
  // SHARED HELPERS
  // =============================================

  // Remove empty string values from schema recursively
  function cleanSchema(obj) {
    if (Array.isArray(obj)) {
      var arr = obj.filter(function (item) {
        if (typeof item === 'object' && item !== null) {
          var cleaned = cleanSchema(item);
          return Object.keys(cleaned).length > 0;
        }
        return item !== '' && item !== null && item !== undefined;
      }).map(function (item) {
        return typeof item === 'object' && item !== null ? cleanSchema(item) : item;
      });
      return arr;
    }
    if (typeof obj === 'object' && obj !== null) {
      var result = {};
      Object.keys(obj).forEach(function (key) {
        var val = obj[key];
        if (val === '' || val === null || val === undefined) return;
        if (typeof val === 'object') {
          var cleaned = cleanSchema(val);
          if (Array.isArray(cleaned)) {
            if (cleaned.length > 0) result[key] = cleaned;
          } else if (Object.keys(cleaned).length > 0) {
            // Keep @type objects only if they have more than just @type
            var nonTypeKeys = Object.keys(cleaned).filter(function (k) { return k !== '@type'; });
            if (nonTypeKeys.length > 0 || key === '@context') {
              result[key] = cleaned;
            }
          }
        } else {
          result[key] = val;
        }
      });
      return result;
    }
    return obj;
  }

  // Remove a dynamic item
  window.removeDynamicItem = function (btn) {
    var item = btn.closest('.dynamic-item');
    if (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(-8px)';
      item.style.transition = 'all 0.2s ease';
      setTimeout(function () {
        item.remove();
        // Re-number items
        renumberItems();
        // Trigger regeneration
        var genType = document.body.getAttribute('data-generator');
        if (genType) generateSchema(genType);
      }, 200);
    }
  };

  function renumberItems() {
    $$('.dynamic-items').forEach(function (container) {
      container.querySelectorAll('.dynamic-item').forEach(function (item, i) {
        var num = item.querySelector('.dynamic-item-number');
        if (num) {
          var text = num.textContent.replace(/\d+/, (i + 1));
          num.textContent = text;
        }
      });
    });
  }

  function bindFormEvents(el) {
    var genType = document.body.getAttribute('data-generator');
    if (!genType) return;
    el.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () { generateSchema(genType); });
      input.addEventListener('change', function () { generateSchema(genType); });
    });
  }

  // =============================================
  // RICH RESULT PREVIEW
  // =============================================
  function updateRichPreview(type, schema) {
    var preview = $('#richPreview');
    if (!preview) return;

    switch (type) {
      case 'faq': renderFAQPreview(preview, schema); break;
      case 'local-business': renderLocalBusinessPreview(preview, schema); break;
      case 'article': renderArticlePreview(preview, schema); break;
      case 'product': renderProductPreview(preview, schema); break;
      case 'event': renderEventPreview(preview, schema); break;
      case 'howto': renderHowToPreview(preview, schema); break;
      case 'organization': renderOrganizationPreview(preview, schema); break;
      case 'recipe': renderRecipePreview(preview, schema); break;
    }
  }

  function escHTML(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderFAQPreview(el, schema) {
    var title = 'Your Page Title';
    var url = 'https://example.com';
    var faqs = (schema.mainEntity || []).filter(function (q) { return q.name; });
    var html = '<div class="rich-preview">' +
      '<div class="rich-preview-label">FAQ</div>' +
      '<div class="rich-preview-title">' + escHTML(title) + '</div>' +
      '<div class="rich-preview-url">' + escHTML(url) + '</div>' +
      '<div class="rich-preview-desc">Page description will appear here...</div>';

    if (faqs.length > 0) {
      html += '<div class="rich-preview-faq">';
      faqs.slice(0, 4).forEach(function (q) {
        html += '<div class="rich-preview-faq-item">' +
          '<div class="rich-preview-faq-q">' + escHTML(q.name) + '</div>' +
          '</div>';
      });
      if (faqs.length > 4) {
        html += '<div style="text-align:center;padding:0.5rem;color:#1a73e8;font-size:0.85rem;cursor:pointer;">Show ' + (faqs.length - 4) + ' more results</div>';
      }
      html += '</div>';
    }

    html += '</div>';
    el.innerHTML = html;
  }

  function renderLocalBusinessPreview(el, schema) {
    var name = schema.name || 'Business Name';
    var phone = schema.telephone || '';
    var addr = schema.address || {};
    var addrStr = [addr.streetAddress, addr.addressLocality, addr.addressRegion].filter(Boolean).join(', ');
    var html = '<div class="rich-preview">' +
      '<div class="rich-preview-label">Local Business</div>' +
      '<div class="rich-preview-title">' + escHTML(name) + '</div>' +
      '<div class="rich-preview-url">' + escHTML(schema.url || 'https://example.com') + '</div>' +
      (addrStr ? '<div class="rich-preview-desc">📍 ' + escHTML(addrStr) + '</div>' : '') +
      (phone ? '<div class="rich-preview-desc">📞 ' + escHTML(phone) + '</div>' : '') +
      (schema.priceRange ? '<div class="rich-preview-desc">💰 Price Range: ' + escHTML(schema.priceRange) + '</div>' : '') +
      '</div>';
    el.innerHTML = html;
  }

  function renderArticlePreview(el, schema) {
    var headline = schema.headline || 'Article Headline';
    var desc = schema.description || 'Article description will appear here...';
    var author = (schema.author && schema.author.name) || '';
    var date = schema.datePublished || '';
    var html = '<div class="rich-preview">' +
      '<div class="rich-preview-label">Article</div>' +
      '<div class="rich-preview-title">' + escHTML(headline) + '</div>' +
      '<div class="rich-preview-url">' + escHTML((schema.publisher && schema.publisher.name) || 'example.com') + '</div>' +
      '<div class="rich-preview-desc">' + escHTML(desc.substring(0, 160)) + '</div>' +
      (author || date ? '<div class="rich-preview-event-date">' + (author ? 'By ' + escHTML(author) : '') + (date ? ' · ' + escHTML(date) : '') + '</div>' : '') +
      '</div>';
    el.innerHTML = html;
  }

  function renderProductPreview(el, schema) {
    var name = schema.name || 'Product Name';
    var desc = schema.description || 'Product description...';
    var offers = schema.offers || {};
    var review = schema.review || {};
    var rating = review.reviewRating ? review.reviewRating.ratingValue : '';
    var price = offers.price || '';
    var currency = offers.priceCurrency || 'USD';
    var stars = rating ? '★'.repeat(Math.round(parseFloat(rating))) + '☆'.repeat(5 - Math.round(parseFloat(rating))) : '';

    var html = '<div class="rich-preview">' +
      '<div class="rich-preview-label">Product</div>' +
      '<div class="rich-preview-title">' + escHTML(name) + '</div>' +
      '<div class="rich-preview-url">example.com</div>';

    if (stars) {
      html += '<div class="rich-preview-rating">' +
        '<span class="rich-preview-stars">' + stars + '</span>' +
        '<span class="rich-preview-rating-text">' + escHTML(rating) + '/5</span>' +
        '</div>';
    }

    if (price) {
      var sym = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency + ' ';
      html += '<div class="rich-preview-price">' + sym + escHTML(price) + '</div>';
    }

    html += '<div class="rich-preview-desc">' + escHTML(desc.substring(0, 120)) + '</div>';
    html += '</div>';
    el.innerHTML = html;
  }

  function renderEventPreview(el, schema) {
    var name = schema.name || 'Event Name';
    var loc = schema.location && schema.location.name ? schema.location.name : '';
    var startDate = schema.startDate || '';
    var offers = schema.offers || {};
    var html = '<div class="rich-preview">' +
      '<div class="rich-preview-label">Event</div>' +
      '<div class="rich-preview-title">' + escHTML(name) + '</div>' +
      '<div class="rich-preview-url">example.com</div>' +
      (startDate ? '<div class="rich-preview-event-date">📅 ' + escHTML(startDate) + '</div>' : '') +
      (loc ? '<div class="rich-preview-desc">📍 ' + escHTML(loc) + '</div>' : '') +
      (offers.price ? '<div class="rich-preview-price">From $' + escHTML(offers.price) + '</div>' : '') +
      '</div>';
    el.innerHTML = html;
  }

  function renderHowToPreview(el, schema) {
    var title = schema.name || 'How-To Title';
    var steps = schema.step || [];
    var html = '<div class="rich-preview">' +
      '<div class="rich-preview-label">How-To</div>' +
      '<div class="rich-preview-title">' + escHTML(title) + '</div>' +
      '<div class="rich-preview-url">example.com</div>';

    if (steps.length > 0) {
      html += '<div style="margin-top:0.5rem;">';
      steps.slice(0, 4).forEach(function (step, i) {
        html += '<div style="padding:0.3rem 0;font-size:0.85rem;color:#4d5156;">' +
          '<strong style="color:#202124;">Step ' + (i + 1) + ':</strong> ' + escHTML(step.name || step.text || '') +
          '</div>';
      });
      if (steps.length > 4) {
        html += '<div style="color:#1a73e8;font-size:0.85rem;padding:0.3rem 0;cursor:pointer;">+ ' + (steps.length - 4) + ' more steps</div>';
      }
      html += '</div>';
    }

    html += '</div>';
    el.innerHTML = html;
  }

  function renderOrganizationPreview(el, schema) {
    var name = schema.name || 'Organization Name';
    var desc = schema.description || '';
    var url = schema.url || 'example.com';
    var html = '<div class="rich-preview">' +
      '<div class="rich-preview-label">Organization</div>' +
      '<div class="rich-preview-title">' + escHTML(name) + '</div>' +
      '<div class="rich-preview-url">' + escHTML(url) + '</div>' +
      '<div class="rich-preview-desc">' + escHTML(desc.substring(0, 160) || 'Organization description...') + '</div>' +
      '</div>';
    el.innerHTML = html;
  }

  function renderRecipePreview(el, schema) {
    var name = schema.name || 'Recipe Name';
    var desc = schema.description || '';
    var author = (schema.author && schema.author.name) || '';
    var totalTime = schema.totalTime || '';
    var recipeYield = schema.recipeYield || '';
    var cal = schema.nutrition ? schema.nutrition.calories : '';
    var html = '<div class="rich-preview">' +
      '<div class="rich-preview-label">Recipe</div>' +
      '<div class="rich-preview-title">' + escHTML(name) + '</div>' +
      '<div class="rich-preview-url">' + (author ? escHTML(author) + ' · ' : '') + 'example.com</div>' +
      '<div class="rich-preview-desc">' + escHTML(desc.substring(0, 120) || 'Recipe description...') + '</div>' +
      '<div class="rich-preview-recipe-meta">' +
        (totalTime ? '<span>⏱ ' + escHTML(totalTime) + '</span>' : '') +
        (recipeYield ? '<span>🍽 ' + escHTML(recipeYield) + '</span>' : '') +
        (cal ? '<span>🔥 ' + escHTML(cal) + '</span>' : '') +
      '</div>' +
      '</div>';
    el.innerHTML = html;
  }

  // =============================================
  // TAB SWITCHING
  // =============================================
  window.switchTab = function (tabId) {
    $$('.tab').forEach(function (t) { t.classList.remove('active'); });
    $$('.tab-content').forEach(function (c) { c.classList.remove('active'); });
    var tab = document.querySelector('[data-tab="' + tabId + '"]');
    var content = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    if (content) content.classList.add('active');
  };

})();
