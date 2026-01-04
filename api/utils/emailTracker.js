const { uuid } = require('uuidv4');
// const EmailTracking = require('../models/EmailTracking');
// const cheerio = require('cheerio');

class EmailTracker {
    // Generate unique tracking ID
    static generateTrackingId() {
        return uuid();
    }

    // Add tracking pixel to email HTML
    static addTrackingPixel(htmlContent, trackingId, baseUrl) {
        const trackingPixel = `<img src="${baseUrl}/api/user/open/${trackingId}" width="1" height="1" style="display:none;" alt="" />`;

        // Insert before closing body tag, or at the end if no body tag
        if (htmlContent.includes('</body>')) {
            return htmlContent.replace('</body>', `${trackingPixel}</body>`);
        } else {
            return htmlContent + trackingPixel;
        }
    }

    // Add click tracking to links
    static addClickTracking(htmlContent, trackingId, baseUrl) {
        const linkRegex = /<a\\b([^>]*?)\\bhref\\s*=\\s*(['\"]?)([^'\">\\s]+)\\2([^>]*)>/gi;
        return htmlContent.replace(linkRegex, (match, before, quote, originalUrl, after) => {
            const trackingUrl = `${baseUrl}/api/user/click/${trackingId}?url=${encodeURIComponent(originalUrl)}`;
            return `<a${before}href=${quote}${trackingUrl}${quote}${after}>`;
        });
    }

    static addUnsubscribeLink(htmlContent, trackingId, baseUrl) {
        const unsubscribeLink = `<div style="margin-top:24px;font-size:12px;text-align:center;">
            <a href="${baseUrl}/api/user/unsubscribe/${trackingId}" style="color:#888;">Unsubscribe</a>
        </div>`;
        if (htmlContent.includes('</body>')) {
            return htmlContent.replace('</body>', `${unsubscribeLink}</body>`);
        } else {
            return htmlContent + unsubscribeLink;
        }
    }

    // // Save email tracking record
    // static async saveEmailTracking(data) {
    //     try {
    //         const emailTracking = new EmailTracking(data);
    //         await emailTracking.save();
    //         return emailTracking;
    //     } catch (error) {
    //         console.error('Error saving email tracking:', error);
    //         throw error;
    //     }
    // }

    // // Record email open
    // static async recordOpen(trackingId, userAgent, ipAddress) {
    //     try {
    //         const result = await EmailTracking.findOneAndUpdate(
    //             { trackingId },
    //             {
    //                 $push: {
    //                     opens: {
    //                         timestamp: new Date(),
    //                         userAgent,
    //                         ipAddress
    //                     }
    //                 },
    //                 $set: { status: 'opened' }
    //             },
    //             { new: true }
    //         );
    //         return result;
    //     } catch (error) {
    //         console.error('Error recording email open:', error);
    //         throw error;
    //     }
    // }

    // // Record link click
    // static async recordClick(trackingId, url, userAgent, ipAddress) {
    //     try {
    //         const result = await EmailTracking.findOneAndUpdate(
    //             { trackingId },
    //             {
    //                 $push: {
    //                     clicks: {
    //                         timestamp: new Date(),
    //                         url,
    //                         userAgent,
    //                         ipAddress
    //                     }
    //                 },
    //                 $set: { status: 'clicked' }
    //             },
    //             { new: true }
    //         );
    //         return result;
    //     } catch (error) {
    //         console.error('Error recording email click:', error);
    //         throw error;
    //     }
    // }
}

module.exports = EmailTracker;