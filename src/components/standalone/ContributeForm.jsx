// src/components/standalone/ContributeForm.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function ContributeForm({ fields = [], resourceTypeOptions = [] }) {
  const [activeTab, setActiveTab] = useState('bottleneck');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Use refs for the common input fields to avoid focus issues
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const commentInputRef = useRef(null);

  // Form data state for tab-specific fields
  const [bottleneckData, setBottleneckData] = useState({
    title: '',
    content: '',
    fieldId: '',
    rank: 3
  });

  const [fcData, setFcData] = useState({
    title: '',
    content: '',
    relatedGap: '',
  });

  const [resourceData, setResourceData] = useState({
    title: '',
    url: '',
    content: '',
    resourceType: resourceTypeOptions.length > 0 ? resourceTypeOptions[0] : 'Publication'
  });

  // Handle tab change
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setFormError('');
  };

  // Get values from refs at submission time
  const getCommonFieldValues = () => {
    return {
      name: nameInputRef.current?.value || '',
      email: emailInputRef.current?.value || '',
      comment: commentInputRef.current?.value || '',
    };
  };

  // Form submission handlers
  const handleBottleneckSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    const commonFields = getCommonFieldValues();

    try {
      const response = await fetch('/.netlify/functions/submit-contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: commonFields.name,
            email: commonFields.email,
            title: bottleneckData.title,
            contentType: 'Bottleneck',
            field: bottleneckData.fieldId,
            rank: bottleneckData.rank,
            content: bottleneckData.content,
            comment: commonFields.comment
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit');
      }

      // Redirect to success page
      window.location.href = '/success';
    } catch (error) {
      console.error('Error submitting bottleneck:', error);
      setFormError(error.message || 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleFCSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    const commonFields = getCommonFieldValues();

    try {
      const response = await fetch('/.netlify/functions/submit-contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: commonFields.name,
            email: commonFields.email,
            title: fcData.title,
            contentType: 'Foundational Capability',
            content: fcData.content,
            relatedGap: fcData.relatedGap,
            comment: commonFields.comment
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit');
      }

      // Redirect to success page
      window.location.href = '/success';
    } catch (error) {
      console.error('Error submitting foundational capability:', error);
      setFormError(error.message || 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    const commonFields = getCommonFieldValues();

    try {
      const response = await fetch('/.netlify/functions/submit-contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: commonFields.name,
            email: commonFields.email,
            title: resourceData.title,
            contentType: 'Resource',
            resourceType: resourceData.resourceType,
            resource: resourceData.url,
            content: resourceData.content,
            comment: commonFields.comment
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit');
      }

      // Redirect to success page
      window.location.href = '/success';
    } catch (error) {
      console.error('Error submitting resource:', error);
      setFormError(error.message || 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Component to render common fields that won't lose focus
  const CommonFieldsSection = () => (
    <div className="form-section contributor-info">
      <div className="form-group">
        <label htmlFor="contributor-name">Your Name *</label>
        <input
          type="text"
          id="contributor-name"
          name="name"
          ref={nameInputRef}
          defaultValue=""
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="contributor-email">Your Email *</label>
        <input
          type="email"
          id="contributor-email"
          name="email"
          ref={emailInputRef}
          defaultValue=""
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="contributor-comment">Additional Comments</label>
        <textarea
          id="contributor-comment"
          name="comment"
          rows="3"
          ref={commentInputRef}
          defaultValue=""
          placeholder="Any additional context or notes you'd like to share"
        ></textarea>
      </div>
    </div>
  );

  return (
    <div className="contribute-form">
      <div className="contribute-form__tabs">
        <button
          className={`contribute-form__tab ${activeTab === 'bottleneck' ? 'active' : ''}`}
          onClick={() => handleTabChange('bottleneck')}
          type="button"
        >
          R&D Gap
        </button>
        <button
          className={`contribute-form__tab ${activeTab === 'capability' ? 'active' : ''}`}
          onClick={() => handleTabChange('capability')}
          type="button"
        >
          Foundational Capability
        </button>
        <button
          className={`contribute-form__tab ${activeTab === 'resource' ? 'active' : ''}`}
          onClick={() => handleTabChange('resource')}
          type="button"
        >
          Resource
        </button>
      </div>

      {formError && (
        <div className="contribute-form__error">
          {formError}
        </div>
      )}

      <div className="contribute-form__content">
        {/* Bottleneck Form */}
        {activeTab === 'bottleneck' && (
          <form onSubmit={handleBottleneckSubmit}>
            <div className="form-group">
              <label htmlFor="bottleneck-title">R&D Gap Name *</label>
              <input
                type="text"
                id="bottleneck-title"
                value={bottleneckData.title}
                onChange={(e) => setBottleneckData({ ...bottleneckData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bottleneck-field">Field *</label>
              <select
                id="bottleneck-field"
                value={bottleneckData.fieldId}
                onChange={(e) => setBottleneckData({ ...bottleneckData, fieldId: e.target.value })}
                required
              >
                <option value="">Select a field</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.field_name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="form-group">
              <label htmlFor="bottleneck-rank">
                Urgency Rank: {bottleneckData.rank}
              </label>
              <input
                type="range"
                id="bottleneck-rank"
                min="0"
                max="5"
                step="1"
                value={bottleneckData.rank}
                onChange={(e) => setBottleneckData({ ...bottleneckData, rank: parseInt(e.target.value) })}
              />
              <div className="range-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div> */}

            <div className="form-group">
              <label htmlFor="bottleneck-content">Description *</label>
              <textarea
                id="bottleneck-content"
                rows="8"
                value={bottleneckData.content}
                onChange={(e) => setBottleneckData({ ...bottleneckData, content: e.target.value })}
                placeholder="Describe the R&D gap in detail. What makes it significant? What are the implications?"
                required
              ></textarea>
            </div>

            {/* Add common fields */}
            <CommonFieldsSection />

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}

        {/* Foundational Capability Form */}
        {activeTab === 'capability' && (
          <form onSubmit={handleFCSubmit}>
            <div className="form-group">
              <label htmlFor="fc-title">Foundational Capability Name *</label>
              <input
                type="text"
                id="fc-title"
                value={fcData.title}
                onChange={(e) => setFcData({ ...fcData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fc-related-gap">Related R&D Gap</label>
              <input
                type="text"
                id="fc-related-gap"
                value={fcData.relatedGap}
                onChange={(e) => setFcData({ ...fcData, relatedGap: e.target.value })}
                placeholder="Enter the name of an existing R&D gap or suggest a new one"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fc-content">Description *</label>
              <textarea
                id="fc-content"
                rows="8"
                value={fcData.content}
                onChange={(e) => setFcData({ ...fcData, content: e.target.value })}
                placeholder="Describe the proposed foundational capability. How would it address the bottleneck? What makes it feasible?"
                required
              ></textarea>
            </div>

            {/* Add common fields */}
            <CommonFieldsSection />

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}

        {/* Resource Form - Updated for single select */}
        {activeTab === 'resource' && (
          <form onSubmit={handleResourceSubmit}>
            <div className="form-group">
              <label htmlFor="resource-title">Resource Title *</label>
              <input
                type="text"
                id="resource-title"
                value={resourceData.title}
                onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="resource-type">Resource Type *</label>
              <select
                id="resource-type"
                value={resourceData.resourceType}
                onChange={(e) => setResourceData({ ...resourceData, resourceType: e.target.value })}
                required
              >
                {resourceTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="resource-url">URL *</label>
              <input
                type="url"
                id="resource-url"
                value={resourceData.url}
                onChange={(e) => setResourceData({ ...resourceData, url: e.target.value })}
                placeholder="https://example.com/article"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="resource-content">Summary</label>
              <textarea
                id="resource-content"
                rows="6"
                value={resourceData.content}
                onChange={(e) => setResourceData({ ...resourceData, content: e.target.value })}
                placeholder="Provide a brief summary of this resource and its relevance"
              ></textarea>
            </div>

            {/* Add common fields */}
            <CommonFieldsSection />

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}